import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { Permission } from './domain/permission';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { PermissionAbstractRepository } from './infrastructure/persistence/relational/repositories/abstract-permission.repository.abstract';
import {
  FilterPermissionDto,
  SortPermissionDto,
} from './dto/query-permission.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';

@Injectable()
export class PermissionService {
  constructor(
    private redisService: RedisService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private readonly permissionRepository: PermissionAbstractRepository,
    //private readonly roleService: RoleService,
  ) {}

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    const cacheKey = `user_permissions:${userId}`;

    let permissions: any = await this.redisService.get(cacheKey);

    if (!permissions) {
      const user = await this.userService.findOne({ id: userId }, [
        'roles',
        'permissions',
      ]);

      // permissions = [
      //     user?.role!.!.map(p => p.name),
      //     user?.permissons!.map(p => p.name),
      // ];

      await this.redisService.setex(
        cacheKey,
        3600,
        JSON.stringify(permissions),
      );
    } else {
      permissions = JSON.parse(permissions);
    }

    return permissions.includes(permission);
  }

  async findOnePermission(
    condition: EntityCondition<Permission>,
  ): Promise<Permission | null> {
    // Call the repository's findOne method
    
    return this.permissionRepository.findOne(condition);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPermissionDto | null;
    sortOptions?: SortPermissionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<any>> {
    const permissions = await this.permissionRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
    // Fetch all permissions without pagination if filterOption.roleId exists
    let allPermission;
    if (filterOptions?.roleId) {
      allPermission = await this.permissionRepository.findManyWithPagination({
        paginationOptions: { page: 1, limit: 10000 },
      });
      for (const permission of allPermission.data) {

        permission.isHave = filterOptions?.roleId
          ? permissions.data.some((p: any) => p.id === permission.id)
          : false;
      }
  
    }

    if (!filterOptions?.roleId) {
      for (const permission of permissions.data) {
        permission.isHave = filterOptions?.roleId
          ? allPermission.data.some((p: any) => p.id === permission.id)
          : false;
      }
    }

    // Iterate over permissions and set isHave based on filterOption.roleId
    // if (filterOptions?.roleId) {
    //   for (const permission of permissions.data) {
    //     permission.isHave = filterOptions?.roleId
    //       ? allPermission.data.some((p: any) => p.id === permission.id)
    //       : false;
    //   }
    // }

    const groupedPermissions: { [tag: string]: Permission[] } = {};
    if (filterOptions?.roleId) {
      allPermission.data.forEach((permission: any) => {
        if (!groupedPermissions[permission.tag!]) {
          groupedPermissions[permission.tag!] = [];
        }
        groupedPermissions[permission.tag!].push(permission);
      });
    } else {
      permissions.data.forEach((permission: any) => {
        if (!groupedPermissions[permission.tag!]) {
          groupedPermissions[permission.tag!] = [];
        }
        groupedPermissions[permission.tag!].push(permission);
      });
    }

    // Convert groupedPermissions object to array of objects with tag and permissions
    const permissionArray = Object.entries(groupedPermissions).map(
      ([tag, permissions]) => ({
        tag,
        permissions,
      }),
    );

    return {
      data: permissionArray,
      currentPage: paginationOptions.page,
      totalRecords: permissions.totalRecords,
      hasNextPage: permissions.hasNextPage,
    };
  }
}
