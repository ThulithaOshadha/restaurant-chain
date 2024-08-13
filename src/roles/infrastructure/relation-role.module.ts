import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { AbstractRoleRepository } from './repositories/role.abstact-repository';
import { RoleRepository } from './repositories/role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [
    {
      provide: AbstractRoleRepository,
      useClass: RoleRepository,
    },
  ],
  exports: [AbstractRoleRepository],
})
export class RelationalRolePersistenceModule {}
