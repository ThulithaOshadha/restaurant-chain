import { Facility } from "src/facilities/domain/facility";
import { FilterFacilityDto } from "src/facilities/dto/filter-facility.dto";
import { Product } from "src/products/domain/product";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { NullableType } from "src/utils/types/nullable.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";

export abstract class AbstractFacilitiesRepository {
    abstract create(
        data: Omit<Facility, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    ): Promise<Facility>;

    abstract findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterFacilityDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Facility>>;
 
    abstract findOne(
        fields: EntityCondition<Facility>,
    ): Promise<NullableType<Facility>>;

    // New method for general product data update
    abstract update(
        productId: string,
        updateData: Partial<Facility>,
    ): Promise<Product>;

    abstract softDelete(id: Facility['id']): Promise<void>;

}