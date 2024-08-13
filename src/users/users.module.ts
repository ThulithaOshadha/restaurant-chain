import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { FilesModule } from '../files/files.module';
import { UsersService } from './users.service';
import { RelationalUserPersistenceModule } from './infrastructure/relational-persistence.module';
import { RedisService } from '../redis/redis.service';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../roles/role.module';

@Module({
  imports: [
    PermissionModule,
    RelationalUserPersistenceModule,
    FilesModule,
    RoleModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RedisService],
  exports: [UsersService, RelationalUserPersistenceModule],
})
export class UsersModule {}
