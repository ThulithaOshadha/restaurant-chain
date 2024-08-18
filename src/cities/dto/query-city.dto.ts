import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { City } from '../domain/city.domain';

export class QueryCityDto {
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
    return value ? plainToInstance(SortCityDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortCityDto)
  sort?: SortCityDto[] | null;

  @ValidateNested()
  @Type(() => FilterCityDto)
  filters?: FilterCityDto | null;
}

export class SortCityDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof City;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterCityDto {
  @ApiProperty()
  @IsOptional()
  name?: string;
}
