import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Permission } from 'src/permission/domain/permission';
import { Role } from 'src/roles/domain/role';
import { RoleDto } from 'src/roles/dto/role.dto';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class InputRolePermissionDto {
  @ApiProperty({ type: Role })
  @IsOptional()
  @Type(() => Role)
  role: Role;

  @ApiProperty({type: Permission})
  @IsNotEmpty()
  @Type(() => Permission)
  permission: string[];

  @ApiProperty()
  @IsOptional()
  status?: StatusEnum;
}
