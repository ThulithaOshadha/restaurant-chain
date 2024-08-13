import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEnum } from 'src/permission/enum/permission.enum';
import { PermissionEntity } from 'src/permission/infrastructure/persistence/relational/entities/permission.entity';
import { Repository } from 'typeorm';

interface SinglePermission {
  name: PermissionEnum;
  tag: string;
}

@Injectable()
export class PermissionSeedService {
  constructor(
    @InjectRepository(PermissionEntity)
    private repository: Repository<PermissionEntity>,
  ) {}

  async run() {
    const permissions = await this.createPermission();

    const savePromises = permissions.map(async (permission) => {
      const isExist = await this.isExist(permission.name);
      if (!isExist) {
        await this.repository.save(
          this.repository.create({
            name: permission.name,
            tag: permission.tag,
          }),
        );
      }
    });

    await Promise.all(savePromises);
  }

  async isExist(permission: PermissionEnum): Promise<boolean> {
    const count = await this.repository.count({
      where: { name: permission },
    });
    return count > 0;
  }

  async createPermission(): Promise<SinglePermission[]> {
    const permissionArray: SinglePermission[] = [];
    const permissions = Object.values(PermissionEnum);

    const tags = {
      USER: ['CREATE_USER', 'UPDATE_USER', 'VIEW_USER', 'DELETE_USER'],
      RESERVAION: [
        'CREATE_RESERVAION',
        'UPDATE_RESERVAION',
        'VIEW_RESERVAION',
        'UPDATE_RESERVAION_STATUS',
        'UPDATE_RESERVAION_CUSTOMER_DETAILS',
      ],
      PRODUCT: [
        'CREATE_PRODUCT',
        'UPDATE_PRODUCT',
        'VIEW_PRODUCT',
        'DELETE_PRODUCT',
      ],
      PACKAGE: [
        'CREATE_PACKAGE',
        'UPDATE_PACKAGE',
        'VIEW_PACKAGE',
        'DELETE_PACKAGE',
        'MANAGE_PACKAGE_ADDON',
      ],
      CATEGORY: [
        'VIEW_CATEGORY',
        'CREATE_CATEGORY',
        'UPDATE_CATEGORY',
        'DELETE_CATEGORY',
      ],
      BRANCH: [
        'VIEW_BRANCH',
        'CREATE_BRANCH',
        'UPDATE_BRANCH',
        'DELETE_BRANCH',
      ],
      
      PRICE_MANAGE: ['SUB_PRODUCT_PRICE_MANAGE', 'PACKAGE_PRICE_MANAGE'],

     

      CUSTOMER: ['VIEW_CUSTOMER', 'TERMINATE_CUSTOMER'],
      ROLE: [
        'CREATE_ROLE',
        'UPDATE_ROLE',
        'VIEW_ROLE',
        'DELETE_ROLE',
        'ASSIGN_PERMISSION',
      ],

      PAYMENTS: ['VIEW_PAYMENTS', 'CREATE_PAYMENTS'],

      PERMISSION_MANAGE: ['PERMISSION_MANAGE'],

      REPORT: ['VIEW_REPORT'],
    };

    permissions.forEach((permission) => {
      for (const tag in tags) {
        if (tags[tag].includes(permission)) {
          permissionArray.push({ name: permission as PermissionEnum, tag });
          break;
        }
      }
    });

    return permissionArray;
  }
}
