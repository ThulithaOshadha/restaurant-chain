import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { PermissionEntity } from './infrastructure/persistence/relational/entities/permission.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from './permissions.guard';
import { PermissionEnum } from './enum/permission.enum';
import { Permission } from './permissions.decorator';

@ApiTags('permissions')
@Controller({
  path: 'permissions',
  
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiBearerAuth()
  // @Permission(PermissionEnum.PERMISSION_MANAGE)
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get('get-all-permissions')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 10000) })
    limits?: number,
    @Query('roleId') roleId?: number,
  ) {    

    const page = pages ?? 1;
    let limit = limits ?? 10000;

    const paginationResult = await this.permissionService.findManyWithPagination({
      filterOptions: { roleId },
      sortOptions: [],
      paginationOptions: {
        page,
        limit,
      },
    });

    const { totalRecords } = paginationResult;

    return {
      ...paginationResult,
      totalRecords,
    };
  }

  @ApiBearerAuth()
  // @Permission(PermissionEnum.PERMISSION_MANAGE)
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  findOnePermission(@Param('id') id: string) {
    const condition: EntityCondition<PermissionEntity> = { id };
    return this.permissionService.findOnePermission(condition);
  }

  @ApiBearerAuth()
  // @Permission(PermissionEnum.PERMISSION_MANAGE)
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get('check/:userId/:permission')
  checkUserPermission(
    @Param('userId') userId: string,
    @Param('permission') permission: string,
  ) {
    return this.permissionService.checkPermission(userId, permission);
  }

}
