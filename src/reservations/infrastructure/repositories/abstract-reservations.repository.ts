import { NullableType } from '../../../utils/types/nullable.type';
import { Order } from '../../../order/domain/order';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';
import { Reservation } from '../../../reservations/domain/reservation.domain';
import { FilterReservationDto, SortReservationDto } from '../../../reservations/dto/query-reservation.dto';


export abstract class AbstractReservationRepository {
  abstract create(
    data: Omit<Reservation, 'id' | 'createdAt ' | 'updatedAt'>,
  ): Promise<any>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterReservationDto | null;
    sortOptions?: SortReservationDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Order>>;


  abstract findOne(
    fields: EntityCondition<Reservation>,
  ): Promise<NullableType<Reservation>>;

  abstract updateReservation(id: string, reservation: Reservation): Promise<Reservation>;

}
