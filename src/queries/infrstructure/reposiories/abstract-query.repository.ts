import { NullableType } from '../../../utils/types/nullable.type';
import { EntityCondition } from '../../../utils/types/entity-condition.type';

import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { DeepPartial } from 'typeorm';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';
import { QueryDomain } from '../../../queries/domain/query';
import { FilterQueryDto } from '../../../queries/dto/filter-query.dto';

export abstract class AbstractQueryRepository {
  abstract create(
    data: Omit<QueryDomain, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<QueryDomain>;

  abstract findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQueryDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<QueryDomain>>;

  abstract findOne(fields: EntityCondition<QueryDomain>): Promise<NullableType<QueryDomain>>;

  abstract update(
    id: string,
    updateData: DeepPartial<QueryDomain>,
  ): Promise<QueryDomain>;

  abstract softDelete(id: QueryDomain['id']): Promise<void>;
}
