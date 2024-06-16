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

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, retypedPassword, ...rest } = createUserDto;

    if (password !== retypedPassword) {
      throw new BadRequestException(
        'Password and retyped password do not match',
      );
    }

    try {
      const user = new User({
        ...rest,
        password: await this.authService.hashPassword(password),
      });

      return await this.userRepository.save(user);
    } catch (error) {
      // this.logger.error(error.message);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('User already exists');
      }
      throw new BadRequestException(error.code);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOneByOrFail({ id });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneByOrFail({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  updateLastLogin(id: string) {
    return this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async remove(id: string) {
    const { affected } = await this.userRepository.delete(id);

    if (affected === 0) {
      throw new BadRequestException('User not found');
    }

    return `User with id ${id} has been deleted`;
  }
}
