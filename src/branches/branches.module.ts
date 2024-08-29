import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { BranchPersistenceModule } from './infrastructure/branches-persistance.module';
import { FacilitiesModule } from 'src/facilities/facilities.module';

@Module({
  imports: [BranchPersistenceModule, FacilitiesModule],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService]
})
export class BranchesModule { }
