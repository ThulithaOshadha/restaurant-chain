import { Injectable } from '@nestjs/common';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, In, Repository } from 'typeorm';
import { RolePermission } from 'src/role-permission/domain/role-permission';
import { FilterRolePermissionDto } from 'src/role-permission/dto/query-role-permission.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { RolePermissionMapper } from '../mappers/role-permission.mapper';
import { RolePermissionAbstractRepository } from './abstract-role-permission.repository';
import { RoleMapper } from 'src/roles/infrastructure/mappers/role.mapper';
import { PermissionMapper } from 'src/permission/infrastructure/persistence/relational/mappers/permission.mapper';

@Injectable()
export class RolePermissionRepository
  implements RolePermissionAbstractRepository
{
  constructor(
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
  ) {}
  async delete(id: string): Promise<boolean> {
    const isDeleted = await this.rolePermissionRepository.delete({ id });
    if (isDeleted) {
      return true;
    }
    return false;
  }

  async create(data: RolePermission): Promise<RolePermission> {
    const persistenceModel = RolePermissionMapper.toPersistence(data);

    const rolePercistencemodel = RoleMapper.toPersistence(data.role);
    const permissionPercistencemodel = PermissionMapper.toPersistence(
      data.permission,
    );

    const newEntity = await this.rolePermissionRepository.save(
      this.rolePermissionRepository.create(persistenceModel),
    );
    return RolePermissionMapper.toDomain(newEntity);
  }
  async findManyWithPagination({
    filterOptions,
  }: {
    filterOptions?: FilterRolePermissionDto | null | undefined;
  }): Promise<RolePermission[]> {
    const where: FindOptionsWhere<RolePermissionEntity> = {};
    
      where['role.id'] = (filterOptions?.roleId);
    

    const entities = await this.rolePermissionRepository.find({
      where,
      relations: ['permission', 'role'],
    });

    return entities.map((rolePermission) =>
      RolePermissionMapper.toDomain(rolePermission),
    );
  }
  async findOne(
    fields: EntityCondition<RolePermission>,
  ): Promise<NullableType<RolePermission>> {
    const entity = await this.rolePermissionRepository.findOne({
      where: fields as FindOptionsWhere<RolePermissionEntity>,
    });

    return entity ? RolePermissionMapper.toDomain(entity) : null;
  }

  async update(
    id: string,
    payload: DeepPartial<RolePermission>,
  ): Promise<RolePermission | null> {
    throw new Error('Method not implemented.');
  }
  async softDelete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async deletePermissionsByRole(id: number): Promise<boolean> {
    const deleted = await this.rolePermissionRepository.delete({
      role: { id },
    });
    if (deleted) {
      return true;
    }
    return false;
  }
}
