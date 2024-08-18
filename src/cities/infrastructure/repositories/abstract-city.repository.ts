import { NullableType } from '../../../utils/types/nullable.type';
import { EntityCondition } from '../../../utils/types/entity-condition.type';

import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { City } from '../../../cities/domain/city.domain';
import { FilterCityDto, SortCityDto } from '../../../cities/dto/query-city.dto';
import { DeepPartial } from 'typeorm';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';

export abstract class AbstractCityRepository {
  abstract create(
    data: Omit<City, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<City>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCityDto | null;
    sortOptions?: SortCityDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<City>>;

  abstract findOne(fields: EntityCondition<City>): Promise<NullableType<City>>;

  abstract updateCitytData(
    cityId: string,
    updateData: DeepPartial<City>,
  ): Promise<City>;

  abstract softDelete(id: City['id']): Promise<void>;
}
