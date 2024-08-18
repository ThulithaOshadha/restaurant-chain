import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesEntity } from './entity/city.entity';
import { AbstractCityRepository } from './repositories/abstract-city.repository';
import { CityRepository } from './repositories/city.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CitiesEntity])],
  providers: [
    {
      provide: AbstractCityRepository,
      useClass: CityRepository,
    },
  ],
  exports: [AbstractCityRepository],
})
export class RelationalCityPersistenceModule {}
