import { StatusEnum } from '../../statuses/statuses.enum';
import { FacilityFile } from './facility-files';


export class Facility {
  id?: string;
  name: string;
  files?: FacilityFile[];
  status?: StatusEnum;
  price: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
