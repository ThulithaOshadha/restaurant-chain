import { Module, forwardRef } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RelationalRolePersistenceModule } from './infrastructure/relation-role.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [
    RelationalRolePersistenceModule,
    forwardRef(() => UsersModule),
    RoleModule,
    forwardRef(() => PermissionModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService, RelationalRolePersistenceModule],
})
export class RoleModule {}
