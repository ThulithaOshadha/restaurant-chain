import { Product } from "src/products/domain/product";
import { FilterProductDto } from "src/products/dto/filter-product.dto";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { NullableType } from "src/utils/types/nullable.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";

export abstract class ProductRepository {
    abstract create(
        data: Omit<Product, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    ): Promise<Product>;

    abstract findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterProductDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Product>>;
 
    abstract findOne(
        fields: EntityCondition<Product>,
    ): Promise<NullableType<Product>>;

    // New method for general product data update
    abstract updateProductData(
        productId: string,
        updateData: Partial<Product>,
    ): Promise<Product>;

    abstract softDelete(id: Product['id']): Promise<void>;

}