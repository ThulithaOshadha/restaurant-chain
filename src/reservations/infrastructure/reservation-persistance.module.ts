import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbstractReservationRepository } from './repositories/abstract-reservations.repository';
import { ReservationRepository } from './repositories/reservations.repository';
import { ReservationsEntity } from './entities/reservations.entity';
import { ReservationTablesEntity } from './entities/reservation-tables.entity';
import { RestuarantTablesEntity } from './entities/tables.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationsEntity, ReservationTablesEntity, RestuarantTablesEntity])],
  providers: [
    {
      provide: AbstractReservationRepository,
      useClass: ReservationRepository,
    },
  ],
  exports: [AbstractReservationRepository],
})
export class ReservationPersistenceModule { }
