import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { RolePermission } from '../../../domain/role-permission';
import { NullableType } from 'src/utils/types/nullable.type';
import { FilterRolePermissionDto } from '../../../dto/query-role-permission.dto';
import { DeepPartial } from 'typeorm';

export abstract class RolePermissionAbstractRepository {
  abstract create(
    data: Omit<RolePermission, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<RolePermission>;

  abstract findManyWithPagination({
    filterOptions,
  }: {
    filterOptions?: FilterRolePermissionDto | null;
  }): Promise<RolePermission[]>;

  abstract findOne(
    fields: EntityCondition<RolePermission>,
  ): Promise<NullableType<RolePermission>>;

  abstract update(
    id: RolePermission['id'],
    payload: DeepPartial<RolePermission>,
  ): Promise<RolePermission | null>;

  abstract softDelete(id: RolePermission['id']): Promise<void>;

  abstract delete(id: RolePermission['id']): Promise<boolean>;

  abstract deletePermissionsByRole(id: number): Promise<boolean>;

  //abstract findByRoleId(id: RolePermission['role']): Promise<NullableType<RolePermission[]>>;
}
