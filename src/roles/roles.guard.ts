import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermissionService } from 'src/role-permission/role-permission.service';
import { RoleService } from './role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rolePermissionService: RolePermissionService,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getClass(), context.getHandler()],
    );
    const request = context.switchToHttp().getRequest();

    const userRole = await this.roleService.findOne({
      id: request.user.role.id,
    });

    const userPermissions = await this.rolePermissionService.findMany({
      filterOptions: { roleId: request.user.role.id },
    });

    const userPermissionArray: string[] = [];
    userPermissions.forEach((per) => {
      userPermissionArray.push(per.permission.name);
    });

    const hasPermission = await this.hasPermission(
      permissions,
      userPermissionArray,
    );
    if (hasPermission) {
      return true;
    }
    return false;
  }

  async hasPermission(permissions, desiredPermission) {
    return desiredPermission.some((desiredPerm) => {
      return permissions.some((permission) => permission === desiredPerm);
    });
  }
}
