import { RolePermission } from 'src/role-permission/domain/role-permission';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { RoleEntity } from 'src/roles/infrastructure/entities/role.entity';
import { PermissionEntity } from 'src/permission/infrastructure/persistence/relational/entities/permission.entity';

export class RolePermissionMapper {
  static toDomain(raw: RolePermissionEntity): RolePermission {
    const rolePermission = new RolePermission();
    rolePermission.id = raw.id;
    rolePermission.role = raw.role;
    rolePermission.permission = raw.permission;
    rolePermission.status = raw.status;
    rolePermission.createdAt = raw.createdAt;
    rolePermission.updatedAt = raw.updatedAt;
    return rolePermission;
  }

  static toPersistence(rolePermission: RolePermission): RolePermissionEntity {
    const rolePermissionEntity = new RolePermissionEntity();
    rolePermissionEntity.status = rolePermission.status;

    let role;
    if (rolePermission.role) {
      role = new RoleEntity();
      role.id = rolePermission.role.id;
    }
    rolePermissionEntity.role = role;
    let permission;
    if (rolePermission.permission) {
      permission = new PermissionEntity();
      permission.id = rolePermission.permission.id;
    }
    rolePermissionEntity.permission = permission;
    return rolePermissionEntity;
  }
}
