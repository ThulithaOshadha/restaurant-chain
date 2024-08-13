import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { use } from 'passport';
import { CustomException } from 'src/exception/common-exception';
import { RolePermissionService } from 'src/role-permission/role-permission.service';
import { RoleService } from 'src/roles/role.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => RolePermissionService))
    private readonly rolePermissionService: RolePermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getClass(), context.getHandler()],
    );

    const request = context.switchToHttp().getRequest();

    const user = await this.userService.findOne({ id: request.user.id });
    if (!user) {
      throw new CustomException('user not exist', HttpStatus.NOT_FOUND);
    }

    const userPermissions = await this.rolePermissionService.findMany({
      filterOptions: { roleId: user.role?.id },
    });
    if (!userPermissions.length) {
      throw new CustomException(
        'user does not have permission to this',
        HttpStatus.UNAUTHORIZED,
      );
    }
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
    throw new CustomException(
      'user does not have permission for this task',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async hasPermission(permissions, desiredPermission) {
    return desiredPermission.some((desiredPerm) => {
      return permissions.some((permission) => permission === desiredPerm);
    });
  }
}
