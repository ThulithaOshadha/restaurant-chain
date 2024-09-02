import { User } from 'src/users/domain/user';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { OrderProductsEntity } from '../infrastructure/entity/order-product.entity';
import { PaymentEntity } from 'src/payments/infrastructure/entity/payment.entity';
import { PaymentMethodEnum } from '../enums/payment-method.enum';


export class Order {
  id: string;
  user?: User;
  products?: OrderProductsEntity[];
  total: number;
  shippingAddress?: string;
  orderStatus: OrderStatusEnum;
  paymentMethod? :PaymentMethodEnum;
  payment?: PaymentEntity[];
  orderDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
