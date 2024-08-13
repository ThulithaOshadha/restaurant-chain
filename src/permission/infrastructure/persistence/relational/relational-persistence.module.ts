import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionAbstractRepository } from './repositories/abstract-permission.repository.abstract';
import { PermissionRepository } from './repositories/permission.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  providers: [
    {
      provide: PermissionAbstractRepository,
      useClass: PermissionRepository,
    },
  ],
  exports: [PermissionAbstractRepository],
})
export class RelationalPermissionPersistenceModule {}
