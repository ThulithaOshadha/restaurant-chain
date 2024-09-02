import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
} from 'class-validator';
import { StatusEnum } from '../../statuses/statuses.enum';


export class FilterBranchDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  status?: StatusEnum;
}
