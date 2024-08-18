import { City } from 'src/cities/domain/city.domain';
import { StatusEnum } from '../../statuses/statuses.enum';
import { BranchFile } from './branch-file.domain';

export class Branch {
  id?: string;
  name: string;
  lat?: number;
  lang?: number;
  files?: BranchFile[];
  status?: StatusEnum;
  city?: City;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
