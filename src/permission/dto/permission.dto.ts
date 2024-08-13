import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Permission } from '../../permission/domain/permission';

export class PermissionDto{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}
