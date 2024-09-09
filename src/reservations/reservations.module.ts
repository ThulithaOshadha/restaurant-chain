import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationPersistenceModule } from './infrastructure/reservation-persistance.module';
import { BranchesModule } from 'src/branches/branches.module';

@Module({
  imports: [ReservationPersistenceModule, BranchesModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService]
})
export class ReservationsModule {}
