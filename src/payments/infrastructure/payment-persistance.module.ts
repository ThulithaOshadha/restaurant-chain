import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { AbstractPaymentRepository } from './repositories/abstract-payment.repository';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    {
      provide: AbstractPaymentRepository,
      useClass: PaymentRepository,
    },
  ],
  exports: [AbstractPaymentRepository],
})
export class PaymentPersistenceModule {}
