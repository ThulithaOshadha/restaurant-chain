import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { UserEntity } from '../../../users/infrastructure/entities/user.entity';
import { RoleEnum } from '../../../roles/roles.enum';
import { StatusEnum } from '../../../statuses/statuses.enum';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const countSuperAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.superAdmin,
        },
      },
    });

    if (!countSuperAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('Easy#kitchen24', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: 'super.admin@example.com',
          contactNo: '0714569887',
          password,
          role: {
            id: RoleEnum.superAdmin,
            name: 'superAdmin',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'General',
          lastName: 'Admin',
          email: 'admin@example.com',
          contactNo: '0778522545',
          password,
          role: {
            id: RoleEnum.admin,
            name: 'Admin',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }

    const countCustomer = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.customer,
        },
      },
    });

    if (!countCustomer) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          contactNo: '076653439849',
          password,
          role: {
            id: RoleEnum.customer,
            name: 'customer',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }
  }
}
