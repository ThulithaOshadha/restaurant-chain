import { StatusEnum } from 'src/statuses/statuses.enum';

export class City {
  id: string;
  name: string;
  status?: StatusEnum;
  lat?: number;
  lang?: number;
  mapObject?: any;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
