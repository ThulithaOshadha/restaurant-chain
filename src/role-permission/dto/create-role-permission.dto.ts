import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PermissionDto } from 'src/permission/dto/permission.dto';
import { RoleDto } from 'src/roles/dto/role.dto';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class CreateRolePermissionDto {
  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role: RoleDto;

  @ApiProperty()
  @IsNotEmpty()
  permission: PermissionDto;

  @ApiProperty()
  @IsOptional()
  status: StatusEnum;
}
