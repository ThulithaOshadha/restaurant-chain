import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Role } from 'src/roles/domain/role';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { RoleMapper } from '../mappers/role.mapper';
import { AbstractRoleRepository } from './role.abstact-repository';
import { FilterRoleDto, SortRoleDto } from 'src/roles/dto/query-role.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';

@Injectable()
export class RoleRepository implements AbstractRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions: FilterRoleDto | null | undefined;
    sortOptions: SortRoleDto[] | null | undefined;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Role>> {
    const where: FindOptionsWhere<RoleEntity> = {};
    if (filterOptions?.name?.length) {
      where.name = ILike(`%${filterOptions.name}%`);
    }
    if (filterOptions?.status) {
      where.status = filterOptions.status;
    }

    where.id = Not(1);

    const totalRecords = await this.roleRepository.count({ where });

    paginationOptions.totalRecords = totalRecords;
    const entities = await this.roleRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      //relations: { user: true, orderItems: true, timelines: true },
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
    const records = entities.map((role) => RoleMapper.toDomain(role));

    return {
      data: records,
      currentPage: paginationOptions.page,
      totalRecords: totalRecords,
      hasNextPage: records.length === paginationOptions.limit,
    };
  }

  async findOne(fields: EntityCondition<Role>): Promise<NullableType<Role>> {
    const entity = await this.roleRepository.findOne({
      where: fields as FindOptionsWhere<RoleEntity>,
      relations: ['rolePermission.permission'],
    });
    return entity;
    // return entity ? RoleMapper.toDomain(entity) : null;
  }

  async create(data: Role): Promise<Role> {
    const persistenceModel = RoleMapper.toPersistence(data);
    const newEntity = await this.roleRepository.save(
      this.roleRepository.create(persistenceModel),
    );

    return RoleMapper.toDomain(newEntity);
  }

  async update(id: number, updateData: Role): Promise<Role> {
    const entity = await this.roleRepository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`Category with ID ${id} not found`);
    }

    const updatedEntity = await this.roleRepository.save({
      ...entity,
      ...RoleMapper.toPersistence(updateData),
    });

    return RoleMapper.toDomain(updatedEntity);
  }
  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.roleRepository.softDelete(id);
    return deleteResult.affected! > 0;
  }
}
