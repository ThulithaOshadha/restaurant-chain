import { PermissionEntity } from '../entities/permission.entity';
import { Permission } from '../../../../domain/permission';

export class PermissionMapper {
  static toDomain(raw: PermissionEntity): Permission {
    const permission = new Permission();

    permission.name = raw.name;
    permission.id = raw.id;
    if (raw.tag) {
      permission.tag = raw.tag;
    }
    permission.isHave = false;
    permission.createdAt = raw.createdAt;
    permission.deletedAt = raw.deletedAt;
    return permission;
  }

  static toPersistence(permission: Permission): PermissionEntity {
    const permissionEntity = new PermissionEntity();
    permissionEntity.id = permission.id;
    permissionEntity.name = permission.name;
    permissionEntity.tag = permission.tag!;
    return permissionEntity;
  }
}
