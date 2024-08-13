import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class FilterQueryDto {
    @ApiProperty()
    @IsOptional()
    customerName?: string;
  }