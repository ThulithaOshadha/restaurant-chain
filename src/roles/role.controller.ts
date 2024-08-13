import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './domain/role';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';
import { StatusEnum } from '../statuses/statuses.enum';
import { Permission } from 'src/permission/permissions.decorator';
import { PermissionEnum } from 'src/permission/enum/permission.enum';
import { PermissionsGuard } from 'src/permission/permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('role')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth()
  @Permission(PermissionEnum.CREATE_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @ApiBearerAuth()
  @Permission(PermissionEnum.VIEW_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get('get-all-role')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 10000) })
    limits?: number,
    @Query('name') name?: string,
    @Query('status') status?: StatusEnum,
  ): Promise<InfinityPaginationResultType<Role>> {

    const page = pages ?? 1;
    let limit = limits ?? 10000;

    if (limit > 50) {
      limit = 50;
    }

    const paginationResult = await this.roleService.findManyWithPagination({
      filterOptions: { name, status },
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
  @Permission(PermissionEnum.VIEW_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Role['id']): Promise<NullableType<Role>> {
    return this.roleService.findOne({ id });
  }

  @ApiBearerAuth()
  @Permission(PermissionEnum.UPDATE_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  updateSupplier(
    @Param('id') id: Role['id'],
    @Body() supplierDto: UpdateRoleDto,
  ): Promise<NullableType<Role>> {
    return this.roleService.update(id, supplierDto);
  }

  @ApiBearerAuth()
  @Permission(PermissionEnum.DELETE_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  delete(@Param('id') id: Role['id']): Promise<boolean> {
    return this.roleService.delete(id);
  }
}
