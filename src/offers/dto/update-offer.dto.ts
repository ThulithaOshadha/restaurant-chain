import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { CapitalizeAndTrim } from 'src/utils/common/capitalize-and-trim.decorator';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class UpdateOfferDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @Transform(({ value }) => value.trim().replace(/\s+/g, ' ').toLowerCase())
    @CapitalizeAndTrim()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsOptional()
    discountPercentage?: number;

    @ApiProperty()
    @IsOptional()
    startDate?: Date;

    @ApiProperty()
    @IsOptional()
    endDate?: Date;

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


