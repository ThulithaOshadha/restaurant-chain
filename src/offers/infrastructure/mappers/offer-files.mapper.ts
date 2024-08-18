import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { ProductFile } from 'src/products/domain/product-files';
import { OfferFilesEntity } from '../entities/offer-files.entity';
import { OfferFile } from 'src/offers/domain/offer-file';
import { OffersEntity } from '../entities/offer.entity';

export class OfferFileMapper {
  static toDomain(raw: OfferFilesEntity): OfferFile {
    const offer = new OfferFile();
    offer.id = raw.file?.id;
    offer.altTag = raw.altTag;
    offer.isDefault = raw.isDefault;
    offer.path = raw.file?.path;
    if (raw.offer) {
        offer.productId = raw.offer;
    }

    return offer;
  }

  static toPersistence(offer: OfferFile): OfferFilesEntity {
    const offerFilesEntity = new OfferFilesEntity();
    if (offer.id && typeof offer.id === 'string') {
        offerFilesEntity.id = offer.id;
    }
    let file = new FileEntity();
    if (offer.file) {
      file = new FileEntity();
      file.id = offer.file.id;
    }
    offerFilesEntity.file = file;

    let offers = new OffersEntity();
    if (offer.productId) {
        offers = new OffersEntity();
      offer.id = offer.productId.id;
    }
    offerFilesEntity.offer = offers;
    return offerFilesEntity;
  }
}
