import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusDto } from '../../statuses/dto/status.dto';
import { FileDto } from '../../files/dto/file.dto';
import { Permission } from '../../permission/domain/permission';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string | null;

  @ApiProperty({ example: '09176989354' })
  @IsNotEmpty()
  contactNo: string | null;

 

  @ApiProperty({ type: () => FileDto })
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
