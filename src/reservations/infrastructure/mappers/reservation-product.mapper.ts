import { Reservation } from "src/reservations/domain/reservation.domain";
import { ReservationsEntity } from "../entities/reservations.entity";
import { ProductMapper } from "src/products/infrastructure/mappers/product-mapper";
import { ReservationProduct } from "src/reservations/domain/reservation-product.domain";
import { ReservationProductsEntity } from "../entities/reservation_products.entity";

export class ReservationProductMapper {

    static toDomain(raw: ReservationProductsEntity): ReservationProduct {
        const reservation = new ReservationProduct();
        reservation.id = raw.id;
        reservation.products = raw.product ? ProductMapper.toDomain(raw.product) : null;
        reservation.qty = raw.qty;
        reservation.unitPrice = raw.unitPrice;
        reservation.totalPrice = raw.totalPrice;
        return reservation;
    }
}