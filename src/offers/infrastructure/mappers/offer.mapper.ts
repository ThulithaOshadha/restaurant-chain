import { Offer } from 'src/offers/domain/offer';
import { OffersEntity } from '../entities/offer.entity';
import { OfferFileMapper } from './offer-files.mapper';
export class OfferMapper {
    static toDomain(raw: OffersEntity): Offer {
        const offer = new Offer();

        offer.id = raw.id;
        offer.name = raw.name;
        offer.status = raw.status;
        if (raw.files && raw.files.length) {
            offer.files = raw.files.map((file) => OfferFileMapper.toDomain(file));
        }
        offer.price = raw.price;
        offer.description = raw.description;
        offer.discountPercentage = raw.discountPercentage;
        offer.startDate = raw.startDate;
        offer.endDate = raw.endDate;
        offer.createdAt = raw.createdAt;
        offer.updatedAt = raw.updatedAt;
        offer.deletedAt = raw.deletedAt;
        return offer;
    }

    static toPersistence(offer: Offer): OffersEntity {
        const productEntity = new OffersEntity();
        if (offer.id && typeof offer.id === 'string') {
            productEntity.id = offer.id;
        }
        productEntity.price = offer.price;
        productEntity.name = offer.name;
        productEntity.description = offer.description ? offer.description : '';
        productEntity.status = offer.status!;
        productEntity.discountPercentage = offer.discountPercentage ? offer.discountPercentage : 0;
        productEntity.startDate = offer.startDate ? offer.startDate : null;
        productEntity.endDate = offer.endDate ? offer.endDate : null;
        return productEntity;
    }
}
