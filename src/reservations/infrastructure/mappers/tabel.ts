import { Tables } from "src/reservations/domain/tables";
import { RestuarantTablesEntity } from "../entities/tables.entity";

export class TableMapper {
    static toDomain(raw: RestuarantTablesEntity): Tables {
        const tabel = new Tables();
        tabel.id = raw.id;
        tabel.name = raw.name;
        tabel.personCount = raw.personCount!;
        return tabel;
    }
}