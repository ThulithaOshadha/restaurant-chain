import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { CapitalizeAndTrim } from '../../utils/common/capitalize-and-trim.decorator';

export class CreateBranchDto {
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

  @ApiProperty()
  @IsNotEmpty()
  private facilities: string[];

  // No-args constructor
  constructor(
    name: string = '',
    lat?: number,
    lang?: number,
    files?: FileDto[],
    description?: string,
    facilities: string[] = []
  ) {
    this.name = name.trim().replace(/\s+/g, ' ').toLowerCase();
    this.lat = lat;
    this.lang = lang;
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






