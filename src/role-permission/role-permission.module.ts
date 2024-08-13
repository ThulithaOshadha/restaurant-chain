import { Module, forwardRef } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { RelationalRolePermissioneModule } from './infrastructure/relation-role-permission.module';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from 'src/roles/role.module';

@Module({
  imports: [
    RelationalRolePermissioneModule,
    forwardRef(() => PermissionModule),
    forwardRef(() => RoleModule),
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [RolePermissionService, RelationalRolePermissioneModule],
})
export class RolePermissionModule {}
