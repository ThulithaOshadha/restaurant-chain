import { User } from 'src/users/domain/user';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { OrderProductsEntity } from '../infrastructure/entity/order-product.entity';


export class Order {
  id: string;
  user?: User;
  products?: OrderProductsEntity[];
  total: number;
  shippingAddress?: string;
  orderStatus: OrderStatusEnum;
  //payment?: Payment[];
  orderDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
