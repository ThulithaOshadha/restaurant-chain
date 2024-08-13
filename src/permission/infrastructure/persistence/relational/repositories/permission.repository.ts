import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { PermissionEntity } from '../entities/permission.entity';
import { Permission } from '../../../../../permission/domain/permission';
import { PermissionMapper } from '../mappers/permission.mapper';
import { PermissionAbstractRepository } from './abstract-permission.repository.abstract';
import {
  FilterPermissionDto,
  SortPermissionDto,
} from 'src/permission/dto/query-permission.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';

@Injectable()
export class PermissionRepository implements PermissionAbstractRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}
  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPermissionDto | null | undefined;
    sortOptions?: SortPermissionDto[] | null | undefined;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Permission>> {
    const where: FindOptionsWhere<PermissionEntity> = {};
    if (filterOptions?.roleId) {
      where.rolePermission = { role: { id: filterOptions.roleId } };
    }
    const totalRecords = await this.permissionRepository.count({ where });
    paginationOptions.totalRecords = totalRecords;
    const entities = await this.permissionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,

      //relations: { user: true, orderItems: true, timelines: true },
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    // console.log('entities : ', entities);
    const records = entities.map((order) => PermissionMapper.toDomain(order));
    return {
      data: records,
      currentPage: paginationOptions.page,
      totalRecords: totalRecords,
      hasNextPage: records.length === paginationOptions.limit,
    };
  }

  async findOne(
    fields: EntityCondition<Permission>,
  ): Promise<NullableType<Permission>> {

    const entity = await this.permissionRepository.findOne({
      where: fields as FindOptionsWhere<PermissionEntity>,
    });

    return entity ? PermissionMapper.toDomain(entity) : null;
  }

  async create(data: Permission): Promise<Permission> {
    const persistenceModel = PermissionMapper.toPersistence(data);
    return this.permissionRepository.save(
      this.permissionRepository.create(persistenceModel),
    );
  }
}
