import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Role } from '../domain/role';

export class RoleDto implements Role {
  @ApiProperty()
  @IsString()
  name: string ;
  @ApiProperty()
  @IsNumber()
  id: number;
}
