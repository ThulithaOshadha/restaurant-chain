import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/roles/infrastructure/entities/role.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countSuperAdmin = await this.repository.count({
      where: {
        id: RoleEnum.superAdmin,
      },
    });

    if (!countSuperAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.superAdmin,
          name: 'Super Admin',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin,
          name: 'Admin',
        }),
      );
    }

    const countCustomer = await this.repository.count({
      where: {
        id: RoleEnum.customer,
      },
    });

    if (!countCustomer) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.customer,
          name: 'Customer',
        }),
      );
    }
  }
}
