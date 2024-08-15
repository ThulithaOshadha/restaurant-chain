import { StatusEnum } from '../../statuses/statuses.enum';
import { ProductFile } from './product-files';


export class Product {
  id?: string;
  name: string;
  files?: ProductFile[];
  status?: StatusEnum;
  price: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
