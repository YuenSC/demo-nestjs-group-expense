import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationFilterDto } from '../../common/pagination/pagination-filter.dto';
import { PaginationService } from '../../common/pagination/pagination.service';
import { User } from '../users/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { UserGroupService } from './user-group.service';

@Injectable()
export class GroupsService extends PaginationService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly userGroupService: UserGroupService,
  ) {
    super();
  }

  async create(createGroupDto: CreateGroupDto, creator: User) {
    return await this.groupRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const group = new Group({ ...createGroupDto, createdBy: creator.id });
        const createdGroup = await transactionalEntityManager.save(group);

        await this.userGroupService.createFirstAdminByEntityManager(
          transactionalEntityManager,
          createdGroup,
          { users: [{ id: creator.id, isAdmin: true }] },
        );
        return createdGroup;
      },
    );
  }
  async findAll(paginationFilterDto: PaginationFilterDto) {
    return await this.paginate(this.groupRepository, paginationFilterDto, {});
  }

  async findOne(id: string) {
    const group = await this.groupRepository.findOneOrFail({
      where: { id },
      relations: ['userGroups', 'userGroups.user'],
    });

    const users = await Promise.all(
      group.userGroups.map(async (userGroup) => {
        return {
          user: userGroup.user,
          isAdmin: userGroup.isAdmin,
        };
      }),
    );

    const transformedGroup = { ...group, users };
    delete transformedGroup.userGroups;
    return transformedGroup;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOneByOrFail({ id });
    return await this.groupRepository.save({ ...group, ...updateGroupDto });
  }

  async remove(id: string) {
    const { affected } = await this.groupRepository.delete(id);

    if (affected === 0) {
      throw new BadRequestException('Group not found');
    }

    return `Group with id ${id} has been deleted`;
  }

  async resetAll() {
    await Promise.all([
      this.groupRepository.createQueryBuilder().delete().execute(),
      this.userGroupService.resetAll(),
    ]);
  }
}
