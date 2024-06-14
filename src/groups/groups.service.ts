import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';
import { UserGroup } from './entities/user-group.entity';
import { AddUserDto } from './dto/add-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const group = new Group(createGroupDto);
    return await this.groupRepository.save(group);
  }

  async findAll() {
    return await this.groupRepository.find();
  }

  async findOne(id: string) {
    return await this.groupRepository.findOneBy({ id });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addUsers(id: string, addUserDto: AddUserDto) {
    return 'This action adds new users to a group';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removeUsers(id: string, removeUserDto: RemoveUserDto) {
    return 'This action removes a new user from a group';
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOneBy({ id });
    return await this.groupRepository.save({ ...group, ...updateGroupDto });
  }

  async remove(id: string) {
    const { affected } = await this.groupRepository.delete(id);

    if (affected === 0) {
      throw new BadRequestException('Group not found');
    }

    return `Group with id ${id} has been deleted`;
  }
}
