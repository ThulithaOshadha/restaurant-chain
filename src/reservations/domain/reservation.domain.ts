import { Branch } from "../../branches/domain/branch.domain";
import { ReservationStatusEnum } from "../../statuses/reservation-status.enum";
import { User } from "../../users/domain/user";
import { ReservationProduct } from "./reservation-product.domain";

export class Reservation {
    id: string;
    user: User;
    branch: Branch;
    reservationDate?: Date;
    personCount?: number;
    total: number;
    status:ReservationStatusEnum;
    products: ReservationProduct;
    createdDate?: Date;
}