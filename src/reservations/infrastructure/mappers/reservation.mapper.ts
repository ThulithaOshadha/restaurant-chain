import { Reservation } from "../../../reservations/domain/reservation.domain";
import { ReservationsEntity } from "../entities/reservations.entity";
import { UserMapper } from "../../../users/infrastructure/mappers/user.mapper";
import { BranchMapper } from "../../../branches/infrastructure/mappers/branch.mapper";
import { BranchesEntity } from "../../../branches/infrastructure/entities/braches.entity";
import { UserEntity } from "../../../users/infrastructure/entities/user.entity";

export class ReservationMapper {

  static toDomain(raw: ReservationsEntity): Reservation {
    const reservation = new Reservation();
    reservation.id = raw.id;
    reservation.user = UserMapper.toDomain(raw.user);
    reservation.branch = BranchMapper.toDomain(raw.branch);
    reservation.reservationDate = raw.reservationDate;
    reservation.personCount = raw.personCount;
    reservation.status = raw.status!;
    reservation.createdDate = raw.createdAt;

    return reservation;
  }

  static toPersistence(reservation: Reservation): ReservationsEntity {
    const reservationEntity = new ReservationsEntity();

    if (reservation.id) {
      reservationEntity.id = reservation.id;
    }
    reservationEntity.reservationDate = reservation.reservationDate;
    reservationEntity.personCount = reservation.personCount;
    if (reservation.status) {
      reservationEntity.status = reservation.status
    }
    let branch;
    if (reservation.branch) {
      branch = new BranchesEntity();
      branch.id = reservation.branch.id;
    }
    reservation.branch = branch;
    let user;
    if (reservation.user) {
      user = new UserEntity();
      user.id = reservation.user.id;
    }
    reservationEntity.user = user;

    return reservationEntity;
  }
}