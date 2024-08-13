import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Role } from '../domain/role';
import { User } from 'src/users/domain/user';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class QueryRoleDto {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortRoleDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortRoleDto)
  sort?: SortRoleDto[] | null;

  @ValidateNested()
  @Type(() => FilterRoleDto)
  filters?: FilterRoleDto | null;
}

export class SortRoleDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Role;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterRoleDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  status?: StatusEnum;
}
