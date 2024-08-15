import { Gallery } from "../../../gallery/domain/gallery";
import { FilterGallerDto } from "../../../gallery/dto/filter-gallery.dto";
import { EntityCondition } from "../../../utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "../../../utils/types/infinity-pagination-result.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";

export abstract class AbstractGalleryRepository {
    abstract create(
        data: Omit<Gallery, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    ): Promise<Gallery>;

    abstract findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterGallerDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Gallery>>;

    abstract findOne(
        fields: EntityCondition<Gallery>,
    ): Promise<NullableType<Gallery>>;
}