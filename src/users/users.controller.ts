import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';
import { User } from './domain/user';
import { UsersService } from './users.service';
import { Permission } from 'src/permission/permissions.decorator';
import { PermissionEnum } from 'src/permission/enum/permission.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { PermissionsGuard } from 'src/permission/permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @Permission(PermissionEnum.CREATE_USER)
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createProfileDto);
  }

  @ApiBearerAuth()
  // @Permission(PermissionEnum.VIEW_USER)
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 10000) })
    limits?: number,
    @Query('name') name?: string,
    @Query('contactNo') contactNo?: string,
    @Query('email') email?: string,
    @Query('role') role?: string,
    @Query('userType') userType?: string,
    @Query('status') status?: number,
  ): Promise<InfinityPaginationResultType<User>> {
    const page = pages ?? 1;
    let limit = limits ?? 10;

    if (limit > 50) {
      limit = 50;
    }

    const paginationResult = await this.usersService.findManyWithPagination({
      filterOptions: { name, contactNo, role, userType, status, email },
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

  @Get('customer/find-all')
  @HttpCode(HttpStatus.OK)
  async findAllCustomer(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 10000) })
    limits?: number,
    @Query('name') name?: string,
    @Query('contactNo') contactNo?: string,
    @Query('email') email?: string,
    @Query('role') role?: string,
    @Query('userType') userType?: string,
    @Query('status') status?: number,
  ): Promise<InfinityPaginationResultType<User>> {
    const page = pages ?? 1;
    let limit = limits ?? 10;

    if (limit > 50) {
      limit = 50;
    }

    const paginationResult = await this.usersService.findManyWithPagination({
      filterOptions: { name, contactNo, role, userType: 'customer', status, email },
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
  // @Permission(PermissionEnum.VIEW_USER)
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
    return this.usersService.findOne({ id });
  }

  @ApiBearerAuth()
  // @Permission(PermissionEnum.UPDATE_USER)
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Patch(':id')
  @Permission(PermissionEnum.UPDATE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: User['id'],
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.usersService.update(id, updateProfileDto);
  }

  @ApiBearerAuth()
  @Permission(PermissionEnum.DELETE_USER)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  @Permission(PermissionEnum.DELETE_USER)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: User['id']): Promise<void> {
    return this.usersService.softDelete(id);
  }

  @ApiBearerAuth()
  @Permission(PermissionEnum.UPDATE_USER)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Patch('set-terminate/:id')
  @Permission(PermissionEnum.UPDATE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  setUserBlackList(
    @Param('id') id: User['id'],
    @Query('status') status: StatusEnum,
  ): Promise<User | null> {
    return this.usersService.setUserBlackList(id, status);
  }
}
