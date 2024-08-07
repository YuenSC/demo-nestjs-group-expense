import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationFilterDto } from '../../common/pagination/pagination-filter.dto';
import { PaginationService } from '../../common/pagination/pagination.service';
import { AuthService } from '../auth/auth.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { OtpService } from '../otp/otp.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends PaginationService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly fileUploadService: FileUploadService,
    private readonly otpService: OtpService,
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
    delete createUserDto.retypedPassword;
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

    return new User({
      ...rest,
      otpSecret: this.otpService.generateOTPSecret(),
      otpRetryChanceLeft: this.otpService.defaultOtpRetryChanceLeft,
      password: hashedPassword,
      imageKey,
    });
  }

  private async saveUser(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          'User with the same email already exists',
        );
      }
      throw new BadRequestException(error.code);
    }
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

    return { items, meta };
  }

  async findOne(id: string) {
    return await this.userRepository.findOneByOrFail({ id });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto & Partial<User>,
    profilePicture?: Express.Multer.File,
  ) {
    const imageKey = profilePicture
      ? await this.processProfilePicture(profilePicture)
      : undefined;
    const updateData = imageKey
      ? { ...updateUserDto, imageKey }
      : updateUserDto;
    await this.userRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: string) {
    try {
      const { affected } = await this.userRepository.delete(id);
      if (affected === 0) {
        throw new BadRequestException('User not found');
      }
      return `User with id ${id} has been deleted`;
    } catch (error) {
      console.log('error', error);
      if (error.code === '23503')
        throw new BadRequestException(
          'Please remove user from group before deleting user',
        );
      throw error;
    }
  }

  async updateLastLogin(id: string) {
    return await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async resetAll() {
    return await this.userRepository.createQueryBuilder().delete().execute();
  }
}
