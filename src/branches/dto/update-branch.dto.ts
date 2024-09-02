import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { CapitalizeAndTrim } from '../../utils/common/capitalize-and-trim.decorator';
import { StatusEnum } from '../../statuses/statuses.enum';

export class UpdateBranchDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' ').toLowerCase())
  @CapitalizeAndTrim()
  private name: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  private lat?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  private lang?: number;

  @ApiProperty({ type: [FileDto] })
  @IsOptional()
  private files?: FileDto[];

  @ApiProperty({ type: String })
  @IsOptional()
  private description?: string;

  @ApiProperty({ enum: StatusEnum, enumName: 'StatusEnum' })
  @IsOptional()
  @IsEnum(StatusEnum)
  @Transform(({ value }) => StatusEnum[value])
  private status?: StatusEnum;

  @ApiProperty()
  @IsNotEmpty()
  private facilities: string[];

  constructor(
    name: string = '',
    lat?: number,
    lang?: number,
    status?: StatusEnum,
    files?: FileDto[],
    description?: string,
    facilities: string[] = []
  ) {
    this.name = name.trim().replace(/\s+/g, ' ').toLowerCase();
    this.lat = lat;
    this.lang = lang;
    this.status = status;
    this.files = files;
    this.description = description;
    this.facilities = facilities;
  }


  // Getters
  get getName(): string {
    return this.name;
  }

  get getLat(): number | undefined {
    return this.lat;
  }

  get getLang(): number | undefined {
    return this.lang;
  }

  get getStatus(): StatusEnum | undefined {
    return this.status;
  }

  get getFiles(): FileDto[] | undefined {
    return this.files;
  }

  get getDescription(): string | undefined {
    return this.description;
  }

  get getFacilities(): string[] {
    return this.facilities;
  }

  // Setters
  set setName(value: string) {
    this.name = value.trim().replace(/\s+/g, ' ').toLowerCase();
  }

  set setLat(value: number | undefined) {
    this.lat = value;
  }

  set setLang(value: number | undefined) {
    this.lang = value;
  }

  set setStatus(value: StatusEnum | undefined) {
    this.status = value;
  }

  set setFiles(value: FileDto[] | undefined) {
    this.files = value;
  }

  set setDescription(value: string | undefined) {
    this.description = value;
  }

  set setFacilities(value: string[]) {
    this.facilities = value;
  }

}


