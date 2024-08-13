import { Module, forwardRef } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { RelationalPermissionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';
import { RolePermissionService } from 'src/role-permission/role-permission.service';

import { PermissionController } from './permission.controller';
import { RoleModule } from 'src/roles/role.module';
import { RolePermissionModule } from 'src/role-permission/role-permission.module';

@Module({
  imports: [
    RelationalPermissionPersistenceModule,
    forwardRef(() => RolePermissionModule),
    forwardRef(() => UsersModule),
    forwardRef(() => FilesModule),
    forwardRef(() =>RoleModule),
  ],
  controllers: [PermissionController], 
  providers: [
    PermissionService,
    RedisService,
    UsersService,
    RolePermissionService,
  ],
  exports: [
    PermissionService,
    RelationalPermissionPersistenceModule,
    RolePermissionService,
  ],
})
export class PermissionModule {}
