import { User } from '../../users/domain/user';

export class QueryDomain {
  id: string;
  user: User;
  queryText: string;
  response?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
