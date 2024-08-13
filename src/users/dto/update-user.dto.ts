import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusDto } from '../../statuses/dto/status.dto';
import { FileDto } from '../../files/dto/file.dto';
import { Permission } from '../../permission/domain/permission';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({ example: '09176989354' })
  @IsOptional()
  contactNo: string | null;

  @ApiProperty({ type: FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto;

  @ApiProperty({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;

  @ApiProperty()
  permissons?: Permission[] | null;

  hash?: string | null;
}
