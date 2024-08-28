import { Reservation } from "src/reservations/domain/reservation.domain";
import { ReservationsEntity } from "../entities/reservations.entity";
import { ProductMapper } from "src/products/infrastructure/mappers/product-mapper";

export class ReservationMapper {

    static toDomain(raw: ReservationsEntity): Reservation {
        const reservation = new Reservation();
        reservation.id = raw.id;
        
        
        return reservation;
      }
}