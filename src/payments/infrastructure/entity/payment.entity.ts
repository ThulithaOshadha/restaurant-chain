import { PaymentMethodEnum } from 'src/order/enums/payment-method.enum';
import { PaymentStatusEnum } from '../../../order/enums/payment-status.enum';
import { OrdersEntity } from '../../../order/infrastructure/entity/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity({ name: 'payment' })
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ default: PaymentStatusEnum.PENDIG })
  status: PaymentStatusEnum;

  @Column({ default: PaymentMethodEnum.CASH_ON_DELEIVERY })
  paymentMethod: PaymentMethodEnum;

  @ManyToOne(() => OrdersEntity, (order) => order.payment)
  @JoinColumn({ name: 'orderId' })
  order: OrdersEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteDate: Date;
}
