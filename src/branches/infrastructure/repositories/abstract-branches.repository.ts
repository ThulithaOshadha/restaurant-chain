import { Branch } from "src/branches/domain/branch.domain";
import { FilterBranchDto } from "src/branches/dto/filter-branch.dto";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { NullableType } from "src/utils/types/nullable.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";

export abstract class AbstractBranchRepository {
    abstract create(
        data: Omit<Branch, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    ): Promise<Branch>;

    abstract findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterBranchDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Branch>>;
 
    abstract findOne(
        fields: EntityCondition<Branch>,
    ): Promise<NullableType<Branch>>;

    abstract update(
        id: string,
        updateData: Partial<Branch>,
    ): Promise<Branch>;

    abstract softDelete(id: Branch['id']): Promise<void>;

}