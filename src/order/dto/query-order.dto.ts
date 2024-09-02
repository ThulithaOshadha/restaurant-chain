import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Order } from '../domain/order';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { PaymentStatusEnum } from '../enums/payment-status.enum';

export class QueryOrderDto {
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
    return value ? plainToInstance(SortOrderDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortOrderDto)
  sort?: SortOrderDto[] | null;

  @ValidateNested()
  @Type(() => FilterOrderDto)
  filters?: FilterOrderDto | null;
}

export class SortOrderDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Order;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterOrderDto {
  @ApiProperty()
  @IsOptional()
  userId?: string;

  @ApiProperty()
  @IsOptional()
  orderEndDate?: Date;

  @ApiProperty()
  @IsOptional()
  orderStatus?: OrderStatusEnum;

  @ApiProperty()
  @IsOptional()
  paymentStatus?: PaymentStatusEnum;
}
