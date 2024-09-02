import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ type: String })
  @IsString()
  firstName: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ type: String })
  @IsString()
  contactNo: string;

}
