import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { Role } from '../../roles/domain/role';
import { Status } from '../../statuses/domain/status';
import { Permission } from '../../permission/domain/permission';

export class User {
  @Expose()
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ['customer', 'superAdmin', 'admin'] })
  provider?: string;

  @Expose({ groups: ['customer'] })
  socialId?: string | null;

  id: string;
  firstName: string | null;
  lastName: string | null;
  contactNo: string | null;
  address?: string | null;
  photo?: FileType | null;
  role?: Role | null;
  permissons?: Permission[] | null;
  rolePermissions?: string[];
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
