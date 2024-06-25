import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { PaginationFilterDto } from '../pagination/pagination-filter.dto';
import { createParseFilePipe } from '../utils/parseFilePipeConfig';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(FileInterceptor('profileImage'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(createParseFilePipe()) file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    if (user.role !== 'admin' && createUserDto.role === 'admin') {
      throw new ForbiddenException('Only admins can create admins');
    }
    return this.usersService.create(createUserDto, file);
  }

  @Post('init')
  async init() {
    if (process.env.NODE_ENV !== 'local')
      throw new Error('This endpoint is only available in test environment');
    await this.usersService.create({
      email: 'c1@admin.com',
      isOnboardingCompleted: false,
      password: 'Example@001',
      role: UserRole.ADMIN,
      name: 'Calvin Admin 1',
      retypedPassword: 'Example@001',
    });
    await this.usersService.create({
      email: 'c1@user.com',
      isOnboardingCompleted: false,
      password: 'Example@001',
      role: UserRole.USER,
      name: 'Calvin User 1',
      retypedPassword: 'Example@001',
    });
  }

  @Get()
  @UseGuards(AuthGuardJwt)
  findAll(@Query() paginationFilterDto: PaginationFilterDto) {
    return this.usersService.findAll(paginationFilterDto);
  }

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(FileInterceptor('profileImage'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(createParseFilePipe()) file: Express.Multer.File,
  ) {
    return this.usersService.update(id, updateUserDto, file);
  }

  @Delete('reset-all')
  @UseGuards(AuthGuardJwt)
  resetAll() {
    if (process.env.NODE_ENV !== 'local')
      throw new Error('This endpoint is only available in test environment');
    return this.usersService.resetAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
