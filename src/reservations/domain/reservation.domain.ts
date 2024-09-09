import { Branch } from "../../branches/domain/branch.domain";
import { ReservationStatusEnum } from "../../statuses/reservation-status.enum";
import { User } from "../../users/domain/user";
import { Tables } from "./tables";

export class Reservation {
    id: string;
    user?: User;
    branch: Branch;
    table?: Tables
    reservationDate?: Date;
    personCount?: number;
    total?: number;
    status?:ReservationStatusEnum;
    createdAt?: Date;
}