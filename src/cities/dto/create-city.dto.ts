import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCityDto {
    @ApiProperty()
    @IsNotEmpty()
    cities: string[]
}