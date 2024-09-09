import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';
import { Reservation } from '../../../reservations/domain/reservation.domain';
import { FilterReservationDto, SortReservationDto } from '../../../reservations/dto/query-reservation.dto';
import { Tables } from '../../../reservations/domain/tables';


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
  }): Promise<InfinityPaginationResultType<Reservation>>;


  abstract findOne(
    fields: EntityCondition<Reservation>,
  ): Promise<NullableType<Reservation>>;

  abstract tableFindOne(
    fields: EntityCondition<Tables>,
  ): Promise<NullableType<Tables>>;

  abstract updateReservation(id: string, reservation: Reservation): Promise<Reservation>;

}
