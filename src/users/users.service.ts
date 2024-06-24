import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { PaginationService } from '../pagination/pagination.service';
import { PaginationFilterDto } from '../pagination/pagination-filter.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class UsersService extends PaginationService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly fileUploadService: FileUploadService,
  ) {
    super();
  }

  // Helper methods
  private validatePasswords(createUserDto: CreateUserDto) {
    const { password, retypedPassword } = createUserDto;
    if (password || retypedPassword) {
      if (password !== retypedPassword) {
        throw new BadRequestException(
          'Password and retyped password do not match',
        );
      }
    }
  }

  private async processProfilePicture(
    profilePicture?: Express.Multer.File,
  ): Promise<string> {
    if (!profilePicture) return '';
    const { key } = await this.fileUploadService.uploadFile(
      profilePicture,
      'profile-pictures/',
    );
    return key;
  }

  private async createUserRecord(
    createUserDto: CreateUserDto,
    imageKey: string,
  ): Promise<User> {
    const { password, ...rest } = createUserDto;
    let hashedPassword = null;
    if (password) {
      hashedPassword = await this.authService.hashPassword(password);
    }
    return new User({ ...rest, password: hashedPassword, imageKey });
  }

  private async saveUser(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleSaveUserError(error);
    }
  }

  private handleSaveUserError(error: any): never {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException('User already exists');
    }
    throw new BadRequestException(error.code);
  }

  public async attachSignedUrlToUser(user: User): Promise<User> {
    const { url } = await this.fileUploadService.getPresignedSignedUrl(
      user.imageKey,
    );
    return new User({
      ...user,
      imageUrl: url,
    });
  }

  // Public methods
  async create(
    createUserDto: CreateUserDto,
    profilePicture?: Express.Multer.File,
  ) {
    this.validatePasswords(createUserDto);

    const imageKey = await this.processProfilePicture(profilePicture);
    const user = await this.createUserRecord(createUserDto, imageKey);

    return this.saveUser(user);
  }

  async findAll(filter: PaginationFilterDto) {
    const { items, meta } = await this.paginate(
      this.userRepository,
      filter,
      {},
    );

    const updatedItems = await Promise.all(
      items.map((user) => this.attachSignedUrlToUser(user)),
    );

    return {
      items: updatedItems,
      meta,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneByOrFail({ id });
    return await this.attachSignedUrlToUser(user);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneByOrFail({ email });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    profilePicture: Express.Multer.File,
  ) {
    const imageKey = await this.processProfilePicture(profilePicture);
    const updateData = imageKey
      ? { ...updateUserDto, imageKey }
      : updateUserDto;
    await this.userRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const { affected } = await this.userRepository.delete(id);

    if (affected === 0) {
      throw new BadRequestException('User not found');
    }

    return `User with id ${id} has been deleted`;
  }

  async updateLastLogin(id: string) {
    return await this.userRepository.update(id, { lastLoginAt: new Date() });
  }
}
