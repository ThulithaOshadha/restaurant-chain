import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../../../permission/infrastructure/persistence/relational/entities/permission.entity';
import { RolePermissionEntity } from '../../../role-permission/infrastructure/persistance/entities/role-permission.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class RolePermissionSeedService {
  constructor(
    @InjectRepository(RolePermissionEntity)
    private rolePermissionRepository: Repository<RolePermissionEntity>,
    @InjectRepository(PermissionEntity)
    private permissionsRepository: Repository<PermissionEntity>,
    private dataSource: DataSource,
  ) {}

  async run() {
    const roleId = 1;

    // Fetch all permissions
    const permissionsArray = await this.permissionsRepository.find();

    // Fetch all existing role-permissions for the role
    const existingRolePermissions = await this.rolePermissionRepository.find({
      where: { role: { id: roleId } },
      relations: ['permission'],
    });

    // Create a Set of existing permission IDs for the role
    const existingPermissionIds = new Set(
      existingRolePermissions.map((rp) => rp.permission.id),
    );

    // Filter permissions that are not already assigned to the role
    const newRolePermissions = permissionsArray
      .filter((permission) => !existingPermissionIds.has(permission.id))
      .map((permission) =>
        this.rolePermissionRepository.create({
          role: { id: roleId },
          permission,
        }),
      );

    if (newRolePermissions.length > 0) {
      await this.dataSource.transaction(async (manager) => {
        await manager.save(RolePermissionEntity, newRolePermissions);
      });
    }
  }
}
