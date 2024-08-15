import { Offer } from "../../../offers/domain/offer";
import { FilterOfferDto } from "../../../offers/dto/filter-offer.dto";
import { EntityCondition } from "../../../utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "../../../utils/types/infinity-pagination-result.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";

export abstract class OffersAbstractRepository {
    abstract create(
        data: Omit<Offer, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    ): Promise<Offer>;

    abstract findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterOfferDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Offer>>;
 
    abstract findOne(
        fields: EntityCondition<Offer>,
    ): Promise<NullableType<Offer>>;

    // New method for general product data update
    abstract updateOfferData(
        productId: string,
        updateData: Partial<Offer>,
    ): Promise<Offer>;

    abstract softDelete(id: Offer['id']): Promise<void>;

}