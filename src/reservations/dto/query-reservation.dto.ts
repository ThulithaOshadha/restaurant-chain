import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Reservation } from '../domain/reservation.domain';

export class QueryReservationDto {
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
    return value ? plainToInstance(SortReservationDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortReservationDto)
  sort?: SortReservationDto[] | null;

  @ValidateNested()
  @Type(() => FilterReservationDto)
  filters?: FilterReservationDto | null;
}

export class SortReservationDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Reservation;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterReservationDto {
  @ApiProperty()
  @IsOptional()
  userId?: string;

  @ApiProperty()
  @IsOptional()
  orderEndDate?: Date;

}
