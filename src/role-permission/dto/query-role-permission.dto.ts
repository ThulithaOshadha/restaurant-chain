import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class FilterRolePermissionDto {
  @ApiProperty()
  @IsOptional()
  roleId?: number;
}
export class QueryRolePermissionDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => FilterRolePermissionDto)
  filters?: FilterRolePermissionDto | null;
}

