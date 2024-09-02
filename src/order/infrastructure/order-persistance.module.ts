import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersEntity } from './entity/order.entity';
import { OrderProductsEntity } from './entity/order-product.entity';
import { PaymentEntity } from '../../payments/infrastructure/entity/payment.entity';
import { AbstractOrderRepository } from './repositories/abstarct-order.repository';
import { OrderRepository } from './repositories/order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity,OrderProductsEntity, PaymentEntity])],
  providers: [
    {
      provide: AbstractOrderRepository,
      useClass: OrderRepository,
    },
  ],
  exports: [AbstractOrderRepository],
})
export class OrderPersistenceModule {}
