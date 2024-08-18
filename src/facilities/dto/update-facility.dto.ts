import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { StatusEnum } from '../../statuses/statuses.enum';
import { CapitalizeAndTrim } from 'src/utils/common/capitalize-and-trim.decorator';

export class UpdateFacilityDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' ').toLowerCase())
  @CapitalizeAndTrim()
  name: string;

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty({ type: [FileDto] })
  @IsOptional()
  files?: FileDto[];

  @ApiProperty({ enum: StatusEnum, enumName: 'StatusEnum' })
  @IsOptional()
  @IsEnum(StatusEnum)
  @Transform(({ value }) => StatusEnum[value])
  status?: StatusEnum;

  @ApiProperty({ type: String })
  @IsOptional()
  description?: string;
}
