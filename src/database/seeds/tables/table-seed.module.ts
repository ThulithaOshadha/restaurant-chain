import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RestuarantTablesEntity } from "src/reservations/infrastructure/entities/restables.enitiy";
import { TableSeedService } from "./table-seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([RestuarantTablesEntity])],
    providers: [TableSeedService],
    exports: [TableSeedService],
  })
  export class TableSeedModule { }