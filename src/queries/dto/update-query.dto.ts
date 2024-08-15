import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateQueryDto {
    @ApiProperty()
    @IsOptional()
    queryText?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    response: string;

}