import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { CreateCustomerDto } from 'src/users/dto/create-customer.dto';


export class CreateOrderDto {
  @ApiProperty()
  @IsOptional()
  customer?: CreateCustomerDto;

  @ApiProperty()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty()
  @IsNotEmpty()
  paymentMethod: PaymentMethodEnum;

  @ApiProperty()
  @IsOptional()
  orderDate?: Date;
}
