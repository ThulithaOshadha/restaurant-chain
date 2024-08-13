import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateQueryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    queryText: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    response: string;

}