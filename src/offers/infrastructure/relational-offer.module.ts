import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { FilesModule } from '../../files/files.module';
import { OffersEntity } from './entities/offer.entity';
import { OfferFilesEntity } from './entities/offer-files.entity';
import { OffersRepository } from './repositories/offer.repository';
import { OffersAbstractRepository } from './repositories/abstract-offer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OffersEntity,
      OfferFilesEntity,
    ]),
    forwardRef(() => FilesModule),
  ],
  providers: [
    {
      provide: OffersAbstractRepository,
      useClass: OffersRepository,
    },
  ],
  exports: [OffersAbstractRepository],
})
export class OffersPersistenceModule {}
