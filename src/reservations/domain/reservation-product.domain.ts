import { Product } from "src/products/domain/product";

export class ReservationProduct {
    id?: string;
    unitPrice: number;
    qty: number;
    totalPrice: number;
    products?: Product | null;
}