import { City } from '../../cities/domain/city.domain';
import { StatusEnum } from '../../statuses/statuses.enum';
import { BranchFile } from './branch-file.domain';
import { Facility } from '../../facilities/domain/facility';

export class Branch {
  id?: string;
  name: string;
  lat?: number;
  lang?: number; 
  files?: BranchFile[];
  status?: StatusEnum;
  city?: City;
  facilities?: Facility[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
