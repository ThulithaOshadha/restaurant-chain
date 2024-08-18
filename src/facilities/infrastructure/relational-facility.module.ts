import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { FacilitiesRepository } from './repositories/facility.repository';
import { FilesModule } from '../../files/files.module';
import { FacilityFilesEntity } from './entities/facility-files.entity';
import { FacilitiesEntity } from './entities/facility.entity';
import { AbstractFacilitiesRepository } from './repositories/abstract-facility.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FacilitiesEntity,
      FacilityFilesEntity,
    ]),
    forwardRef(() => FilesModule),
  ],
  providers: [
    {
      provide: AbstractFacilitiesRepository,
      useClass: FacilitiesRepository,
    },
  ],
  exports: [AbstractFacilitiesRepository],
})
export class FacilityPersistenceModule { }
