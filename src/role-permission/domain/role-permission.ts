import { Expose } from 'class-transformer';
import { Permission } from 'src/permission/domain/permission';
import { Role } from 'src/roles/domain/role';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class RolePermission {
  id: string;
  @Expose()
  role: Role;
  permission: Permission;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
