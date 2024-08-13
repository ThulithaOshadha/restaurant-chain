import { Role } from 'src/roles/domain/role';
import { RoleEntity } from '../entities/role.entity';

export class RoleMapper {
  static toDomain(raw: RoleEntity): Role {
    const role = new Role();
    role.id = raw.id;
    role.name = raw.name;
    role.status = raw.status;
    role.isDefault = raw.isDefault;
    role.createdAt = raw.createdAt;
    role.updatedAt = raw.updatedAt;
    return role;
  }

  static toPersistence(role: Role): RoleEntity {
    const roleEntity = new RoleEntity();
    if (role.id && typeof role.id === 'string') {
      roleEntity.id = role.id;
    }
    roleEntity.name = role.name;
    if (role.status) {
      roleEntity.status = role.status;
    }
    roleEntity.isDefault = role.isDefault!;

    return roleEntity;
  }
}
