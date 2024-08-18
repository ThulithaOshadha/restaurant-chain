import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { FilesModule } from '../../files/files.module';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';
import { AbstractBranchRepository } from './repositories/abstract-branches.repository';
import { BranchRepository } from './repositories/branches.repository';
import { BranchesEntity } from './entities/braches.entity';
import { BranchFilesEntity } from './entities/branch-files.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BranchesEntity,
      BranchFilesEntity,
      FileEntity
    ]),
    forwardRef(() => FilesModule),
  ],
  providers: [
    {
      provide: AbstractBranchRepository,
      useClass: BranchRepository,
    },
  ],
  exports: [AbstractBranchRepository],
})
export class BranchPersistenceModule { }
