export type InfinityPaginationResultType<T> = Readonly<{
  data: T[];
  currentPage: number;
  totalRecords: number;
  hasNextPage: boolean;
}>;
