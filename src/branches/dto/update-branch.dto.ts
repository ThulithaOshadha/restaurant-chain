import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { CapitalizeAndTrim } from 'src/utils/common/capitalize-and-trim.decorator';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class UpdateBranchDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' ').toLowerCase())
  @CapitalizeAndTrim()
  name: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  lat?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  lang?: number;

  @ApiProperty({ type: [FileDto] })
  @IsOptional()
  files?: FileDto[];

  @ApiProperty({ type: String })
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: StatusEnum, enumName: 'StatusEnum' })
  @IsOptional()
  @IsEnum(StatusEnum)
  @Transform(({ value }) => StatusEnum[value])
  status?: StatusEnum;

}


