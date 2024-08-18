import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { RelationalCityPersistenceModule } from './infrastructure/relational-city.module';

@Module({
  imports: [RelationalCityPersistenceModule],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService]
})
export class CitiesModule { }
