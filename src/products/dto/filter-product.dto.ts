import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
} from 'class-validator';
import { StatusEnum } from 'src/statuses/statuses.enum';


export class FilterProductDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  status?: StatusEnum;
}
