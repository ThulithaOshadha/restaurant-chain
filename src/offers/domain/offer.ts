import { StatusEnum } from '../../statuses/statuses.enum';
import { OfferFile } from './offer-file';


export class Offer {
  id?: string;
  name: string;
  files?: OfferFile[];
  status?: StatusEnum;
  price: number;
  description?: string;
  discountPercentage?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
