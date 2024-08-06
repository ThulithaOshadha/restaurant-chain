import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResultType } from './types/infinity-pagination-result.type';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResultType<T> => {
  return {
    data,
    currentPage: options.page,
    totalRecords: options.totalRecords!,
    hasNextPage: data.length === options.limit,
  };
};
