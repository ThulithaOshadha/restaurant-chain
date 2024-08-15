import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { CapitalizeAndTrim } from 'src/utils/common/capitalize-and-trim.decorator';

export class CreateProductDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' ').toLowerCase())
  @CapitalizeAndTrim()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: [FileDto] })
  @IsOptional()
  files?: FileDto[];

  @ApiProperty({ type: String })
  @IsOptional()
  description?: string;

}


