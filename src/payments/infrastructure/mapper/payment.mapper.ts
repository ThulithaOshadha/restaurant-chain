import { OrdersEntity } from '../../../order/infrastructure/entity/order.entity';
import { Payment } from '../../domain/payment.domain';
import { PaymentEntity } from '../entity/payment.entity';

export class PaymentMapper {
  static toDomain(raw: PaymentEntity): Payment {
    const payment = new Payment();
    payment.id = raw.id;
    payment.order = raw.order;
    payment.paymentmethod = raw.paymentMethod;
    payment.amount = raw.amount;
    payment.status = raw.status;
    payment.createdAt = raw.createdAt;
    return payment;
  }

  static toPersistence(payment: Payment): PaymentEntity {
    const ordepaymentEntity = new PaymentEntity();

    let order;
    if (payment.order) {
      order = new OrdersEntity();
      order.id = payment.order.id;
    }
    ordepaymentEntity.order = order;
    ordepaymentEntity.paymentMethod = payment.paymentmethod!;
    ordepaymentEntity.status = payment.status!;
    ordepaymentEntity.amount = payment.amount!;
    return ordepaymentEntity;
  }
}
