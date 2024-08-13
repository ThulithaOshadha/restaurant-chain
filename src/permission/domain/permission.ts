import { Allow } from 'class-validator';

export class Permission {
  id: string;
  @Allow()
  name: string;
  tag?: string;
  isHave?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
