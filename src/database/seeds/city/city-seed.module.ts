import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CitySeedService } from "./city-seed.service";
import { CitiesEntity } from "../../../cities/infrastructure/entity/city.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CitiesEntity])],
    providers: [CitySeedService],
    exports: [CitySeedService],
  })
  export class CitySeedModule { }