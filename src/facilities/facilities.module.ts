import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { FacilityPersistenceModule } from './infrastructure/relational-facility.module';

@Module({
  imports: [FacilityPersistenceModule],
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
  exports: [FacilitiesService]
})
export class FacilitiesModule { }
