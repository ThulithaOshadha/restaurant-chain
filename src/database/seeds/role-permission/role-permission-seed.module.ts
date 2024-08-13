import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '../../../permission/infrastructure/persistence/relational/entities/permission.entity';
import { RolePermissionEntity } from '../../../role-permission/infrastructure/persistance/entities/role-permission.entity';
import { RolePermissionSeedService } from './role-permission-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity, RolePermissionEntity])],
  providers: [RolePermissionSeedService],
  exports: [RolePermissionSeedService],
})
export class RolePermissionSeedModule {}
