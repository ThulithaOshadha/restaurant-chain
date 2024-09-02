import { NullableType } from '../../../utils/types/nullable.type';
import { Order } from '../../../order/domain/order';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';
import { FilterOrderDto, SortOrderDto } from '../../../order/dto/query-order.dto';


export abstract class AbstractOrderRepository {
  abstract create(
    data: Omit<Order, 'id' | 'createdAt ' | 'updatedAt'>,
  ): Promise<any>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterOrderDto | null;
    sortOptions?: SortOrderDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Order>>;


  abstract findOne(
    fields: EntityCondition<Order>,
  ): Promise<NullableType<Order>>;

  abstract updateOrderStatus(id: string, order: Order): Promise<Order>;

  abstract updateOrderPaymentMethod(order: Order): Promise<Order>;

}
