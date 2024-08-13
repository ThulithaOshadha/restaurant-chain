import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { User } from './domain/user';
import { StatusEnum } from '../statuses/statuses.enum';
import { FilesService } from '../files/files.service';
import bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { UserAbstractRepository } from './infrastructure/repositories/user.abstract.repository';
import { RoleService } from '../roles/role.service';
import { CustomException } from 'src/exception/common-exception';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolePermissionService } from 'src/role-permission/role-permission.service';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import path from 'path';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserAbstractRepository,
    private readonly filesService: FilesService,
    private readonly roleService: RoleService,
    private readonly rolePermissionService: RolePermissionService,
    //private readonly addressService: AddressService,
  ) {}

  async create(createProfileDto: CreateUserDto): Promise<User> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
    };

    let userPassword;
    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.role?.id !== RoleEnum.customer) {
      const salt = await bcrypt.genSalt();
      const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
      const password = `${clonedPayload.firstName}${randomDigits}`;
      userPassword = password;
      clonedPayload.password = await bcrypt.hash(password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findOne({
        email: clonedPayload.email,
      });
      if (userObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Email Already Exists',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              photo: 'imageNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = await this.roleService.findOne({
        id: clonedPayload.role.id,
      });

      if (!roleObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              role: 'roleNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              status: 'statusNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    

    const user = await this.usersRepository.create(clonedPayload);
    if (user) {
      await this.sendStaffUserCredentials(user, userPassword);
    }
    return user;
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<User>> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(
    fields: EntityCondition<User>,
    relations?: Array<string>,
  ): Promise<NullableType<User>> {
    const user = await this.usersRepository.findOne(fields, relations);

    if (user) {
      let array: string[] = [];
      const rolePermissionsArray = await this.rolePermissionService.findMany({
        filterOptions: { roleId: user?.role?.id },
      });
      for (const permission of rolePermissionsArray) {
        array.push(permission.permission.name);
      }
      user.rolePermissions = array;
    }

    return user;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User | null> {
    const clonedPayload = { ...payload };

    if (
      clonedPayload.password &&
      clonedPayload.previousPassword !== clonedPayload.password
    ) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findOne({
        email: clonedPayload.email,
      });

      if (userObject?.id !== id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'emailAlreadyExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              photo: 'imageNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = await this.roleService.findOne({
        id: clonedPayload.role.id,
      });
      if (!roleObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              role: 'roleNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              status: 'statusNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const updatedUser = await this.usersRepository.update(id, clonedPayload);
    return await this.findOne({ id: updatedUser?.id });
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async setUserBlackList(
    id: string,
    status: StatusEnum,
  ): Promise<NullableType<User | null>> {
    const user = await this.findOne({ id });
    if (user?.status) {
      user.status.id = status;
      return await this.usersRepository.setUserBlackList(id, user);
    }
    if (!user) {
      throw new CustomException(
        'user not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return null;
  }

  async sendStaffUserCredentials(user: User, password: string) {
    const mailData = {
      to: user.email,
      subject: 'Your Account Credentials',
      text: 'accound details',
      templatePath: path.join(
        __dirname,
        '..',
        'mail',
        'mail-templates',
        'user-credential.hbs',
      ),
      context: {
        logo: 'https://natreeapi.webmotech.com/api/v1/files/10a33db437b2e95d0e0952fc5214be4f7.jpeg',
        name: `${user.firstName} ${user.lastName}`,
        username: user.email,
        password: password,
      },
    };
    //return await this.sendGridService.sendEmail(mailData);
  }

}
