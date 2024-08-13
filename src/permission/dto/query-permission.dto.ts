import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../domain/permission';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

export class QueryPermisssionDto {
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
    return value
      ? plainToInstance(SortPermissionDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortPermissionDto)
  sort?: SortPermissionDto[] | null;

  @ValidateNested()
  @Type(() => FilterPermissionDto)
  filters?: FilterPermissionDto | null;
}

export class SortPermissionDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Permission;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterPermissionDto {
  @ApiProperty()
  @IsOptional()
  roleId?: number;
}
