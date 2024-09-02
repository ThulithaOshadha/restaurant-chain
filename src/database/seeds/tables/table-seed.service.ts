import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestuarantTablesEntity } from 'src/reservations/infrastructure/entities/tables.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TableSeedService {
  constructor(
    @InjectRepository(RestuarantTablesEntity)
    private repository: Repository<RestuarantTablesEntity>,
  ) {}

  async run() {
    const tables = [
      { name: 'C1', personCount: 2 },
      { name: 'C2', personCount: 2 },
      { name: 'C3', personCount: 2 },
      { name: 'F1', personCount: 4 },
      { name: 'F2', personCount: 4 },
      { name: 'F3', personCount: 4 },
      { name: 'F4', personCount: 4 },
      { name: 'L1', personCount: 8 },
      { name: 'L2', personCount: 8 },
      { name: 'L3', personCount: 8 },
    ];

    for (const table of tables) {
      const tableCount = await this.repository.count({
        where: { name: table.name },
      });

      if (!tableCount) {
        await this.repository.save(this.repository.create(table));
      }
    }
  }
}
