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
    if (password !== retypedPassword) {
      throw new BadRequestException(
        'Password and retyped password do not match',
      );
    }
  }

  private async processProfilePicture(
    profilePicture?: Express.Multer.File,
  ): Promise<string> {
    if (!profilePicture) return '';
    const { key } = await this.fileUploadService.uploadFile(profilePicture);
    return key;
  }

  private async createUserRecord(
    createUserDto: CreateUserDto,
    imageKey: string,
  ): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await this.authService.hashPassword(password);
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
    return await this.paginate(this.userRepository, filter, {});
  }

  async findOne(id: string) {
    return await this.userRepository.findOneByOrFail({ id });
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
    await this.userRepository.update(id, { ...updateUserDto, imageKey });
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
