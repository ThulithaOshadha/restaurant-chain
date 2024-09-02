import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TableSeedService } from "./table-seed.service";
import { RestuarantTablesEntity } from "../../../reservations/infrastructure/entities/tables.entity";

@Module({
    imports: [TypeOrmModule.forFeature([RestuarantTablesEntity])],
    providers: [TableSeedService],
    exports: [TableSeedService],
  })
  export class TableSeedModule { }