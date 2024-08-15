import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { OffersPersistenceModule } from './infrastructure/relational-offer.module';

@Module({
  imports: [OffersPersistenceModule],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService]
})
export class OffersModule { }
