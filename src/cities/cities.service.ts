import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { City } from './domain/city.domain';
import { AbstractCityRepository } from './infrastructure/repositories/abstract-city.repository';
import { NullableType } from 'src/utils/types/nullable.type';
import { FilterCityDto, SortCityDto } from './dto/query-city.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { UpdateCityDto } from './dto/update-city.dto';
import { CustomException } from 'src/exception/common-exception';

@Injectable()
export class CitiesService {
    constructor(private readonly cityRepository: AbstractCityRepository) {}

    async findOne(fields: EntityCondition<City>): Promise<NullableType<City>> {
        return await this.cityRepository.findOne(fields);
      }
    
      findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
      }: {
        filterOptions?: FilterCityDto | null;
        sortOptions?: SortCityDto[] | null;
        paginationOptions: IPaginationOptions;
      }): Promise<InfinityPaginationResultType<City>> {
        return this.cityRepository.findManyWithPagination({
          filterOptions,
          sortOptions,
          paginationOptions,
        });
      }
    
      async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
        const isExistCity = await this.findOne({ id });
        if (!isExistCity) {
          throw new CustomException('city does not exist', HttpStatus.NOT_FOUND);
        }
        isExistCity.name = updateCityDto.name;
    
        return this.cityRepository.updateCitytData(id, isExistCity);
      }
      async delete(id: string): Promise<void> {
        return this.cityRepository.softDelete(id);
      }
}
