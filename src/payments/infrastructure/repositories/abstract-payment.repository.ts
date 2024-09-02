import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';
import { Payment } from 'src/payments/domain/payment.domain';
import { FilterPaymentDto, SortPaymentDto } from 'src/payments/dto/query-payment.dto';
import { PaymentStatusEnum } from 'src/order/enums/payment-status.enum';


export abstract class AbstractPaymentRepository {
  abstract create(
    data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Payment>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPaymentDto | null;
    sortOptions?: SortPaymentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Payment>>;

  abstract findOne(
    fields: EntityCondition<Payment>,
  ): Promise<NullableType<Payment>>;

  abstract updatePayment(
    id: string,
    updateData: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Payment>;

  abstract updateOrderpaymentStatus(orderId: string, status: PaymentStatusEnum);
  
  abstract delete(id: string): Promise<void>;
}
