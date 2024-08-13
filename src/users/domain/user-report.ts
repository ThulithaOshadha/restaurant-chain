import { Status } from '../../statuses/domain/status';


export class UserReportDomain {
  email: string | null;
  id: string;
  firstName: string | null;
  lastName: string | null;
  contactNo: string | null;
  address?: string | null;
  orderCount?: number;
  pendingOrderCount?: number;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
