import { Permission } from "../../../../domain/permission";
import { EntityCondition } from "../../../../../utils/types/entity-condition.type";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { FilterPermissionDto, SortPermissionDto } from "src/permission/dto/query-permission.dto";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";


export abstract class PermissionAbstractRepository {
    abstract findOne(
        options: EntityCondition<Permission>,
    ): Promise<NullableType<Permission>>;

    abstract create(
        data: Omit<Permission, 'id' | 'name' | 'updatedAt' | 'createdAt' | 'deletedAt'>,
    ): Promise<Permission>;

    abstract findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
      }: {
        filterOptions?: FilterPermissionDto | null;
        sortOptions?: SortPermissionDto[] | null;
        paginationOptions: IPaginationOptions;
      }): Promise<InfinityPaginationResultType<Permission>>;
}
