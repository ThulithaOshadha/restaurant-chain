import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class UpdateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: StatusEnum, enumName: 'StatusEnum' })
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
