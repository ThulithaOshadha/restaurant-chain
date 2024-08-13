import { Expose } from 'class-transformer';
import { StatusEnum } from '../../statuses/statuses.enum';

export class Role {
  id: number;
  @Expose()
  name: string;
  status?: StatusEnum;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
