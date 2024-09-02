import { PaymentMethodEnum } from '../../order/enums/payment-method.enum';
import { Order } from '../../order/domain/order';
import { PaymentStatusEnum } from '../../order/enums/payment-status.enum';


export class Payment {
  id?: string;
  order?: Order;
  paymentmethod?: PaymentMethodEnum;
  amount?: number;
  status?: PaymentStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
