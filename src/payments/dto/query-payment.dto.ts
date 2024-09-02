import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Payment } from '../domain/payment.domain';
import { PaymentStatusEnum } from '../../order/enums/payment-status.enum';

export class QueryPaymentDto {
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
    return value
      ? plainToInstance(SortPaymentDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortPaymentDto)
  sort?: SortPaymentDto[] | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterPaymentDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterPaymentDto)
  filters?: FilterPaymentDto | null;
}

export class SortPaymentDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Payment;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterPaymentDto {
  @ApiProperty()
  @IsOptional()
  orderId?: string;

  @ApiProperty()
  @IsOptional()
  contactNo?: string;

  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  status?: PaymentStatusEnum;

  @ApiProperty()
  @IsOptional()
  startAmount?: number;

  @ApiProperty()
  @IsOptional()
  endAmount?: number;

  @ApiProperty()
  @IsOptional()
  startDate?: Date;

  @ApiProperty()
  @IsOptional()
  endDate?: Date;
}
