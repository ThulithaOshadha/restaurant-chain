import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAbstractRepository } from './user.abstract.repository';
import {
  DataSource,
  FindOptionsWhere,
  ILike,
  Not,
  Repository,
} from 'typeorm';
import { User } from '../../../users/domain/user';
import { UserMapper } from '../mappers/user.mapper';
import { FilterUserDto, SortUserDto } from '../../../users/dto/query-user.dto';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { UserEntity } from '../entities/user.entity';
import { CustomException } from '../../../exception/common-exception';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';
import { RoleEnum } from 'src/roles/roles.enum';

@Injectable()
export class UserRepository implements UserAbstractRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) { }

  async create(data: User): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const persistenceModel = UserMapper.toPersistence(data);
      const newEntity = await this.usersRepository.save(
        this.usersRepository.create(persistenceModel),
      );

      // Commit transaction
      await queryRunner.commitTransaction();

      return UserMapper.toDomain(newEntity);
    } catch (error) {
      // Rollback in case of an error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<User>> {


    let where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[] =
      {};

    where.role = { id: Not(1) };
    if (filterOptions?.userType === 'staff') {
      where['role.id'] = Not(3);
    }

    if (filterOptions?.userType === 'user') {
      where['role.id'] = 3;
    }

    if (filterOptions?.userType === 'customer') {
      where.role = { id: RoleEnum.customer }
    }


    if (filterOptions?.email?.length) {
      where.email = ILike(`%${filterOptions.email}%`);
    }

    if (filterOptions?.role?.length) {
      where['role.id'] = filterOptions.role;
    }

    if (filterOptions?.contactNo?.length) {
      where.contactNo = ILike(`%${filterOptions.contactNo}%`);
    }
    if (filterOptions?.status) {
      where['status.id'] = filterOptions.status;
    }

    if (filterOptions?.name) {
      const [firstName, ...rest] = filterOptions.name.split(' ');
      const lastName = rest.join(' ');

      where = [
        {
          ...where,
          firstName: ILike(`%${firstName}%`),
          lastName: ILike(`%${lastName}%`),
        },
      ];
    }

    const totalRecords = await this.usersRepository.count({ where });
    paginationOptions.totalRecords = totalRecords;
    const entities = await this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: {
        photo: true,
        role: true,
      },
      order: {
        updatedAt: 'DESC',
        ...sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy]: sort.order,
          }),
          {},
        ),
      },
    });

    const records = entities.map((user) => UserMapper.toDomain(user));
    return {
      data: records,
      currentPage: paginationOptions.page,
      totalRecords: totalRecords,
      hasNextPage: records.length === paginationOptions.limit,
    };
  }

  async findOne(
    fields: EntityCondition<User>,
    relations?: Array<string>,
  ): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: fields as FindOptionsWhere<UserEntity>,
      relations: {
        photo: true,
        role: true,
      },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
  async setUserBlackList(id: string, user: User): Promise<User> {
    try {
      const entity = await this.usersRepository.findOne({
        where: { id },
      });

      const updatedEntity = await this.usersRepository.save({
        ...entity,
        ...UserMapper.toPersistence(user),
      });

      return UserMapper.toDomain(updatedEntity);
    } catch (error) {
      throw new CustomException(`${error}`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }


}
