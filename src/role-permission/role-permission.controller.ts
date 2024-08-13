import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolePermission } from './domain/role-permission';
import { InputRolePermissionDto } from './dto/input-role-permission.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { Permission } from 'src/permission/permissions.decorator';
import { PermissionEnum } from 'src/permission/enum/permission.enum';
import { AuthGuard } from '@nestjs/passport';
@ApiBearerAuth()
@ApiTags('role-permission')
@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @ApiBearerAuth()
  @Permission(PermissionEnum.PERMISSION_MANAGE)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createRolePermissionDto: InputRolePermissionDto,
  ): Promise<RolePermission[]> {
    return this.rolePermissionService.createPermissions(
      createRolePermissionDto,
    );
  }

  @ApiBearerAuth()
  @Permission(PermissionEnum.PERMISSION_MANAGE)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 10) })
    limits?: number,
    @Query('roleId') roleId?: number,
  ): Promise<RolePermission[]> {
    const page = pages ?? 1;
    let limit = limits ?? 10;

    return this.rolePermissionService.findMany({
      filterOptions: { roleId },
    });
  }

  @ApiBearerAuth()
  @Permission(PermissionEnum.PERMISSION_MANAGE)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: RolePermission['id'],
  ): Promise<NullableType<RolePermission>> {
    return this.rolePermissionService.findOne({ id });
  }

  @ApiBearerAuth()
  @Permission(PermissionEnum.PERMISSION_MANAGE)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: RolePermission['id']): Promise<boolean> {
    return this.rolePermissionService.delete(id);
  }
}
