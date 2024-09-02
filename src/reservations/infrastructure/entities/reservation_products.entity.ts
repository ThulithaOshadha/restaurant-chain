import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ReservationsEntity } from './reservations.entity';
import { ProductsEntity } from 'src/products/infrastructure/entities/products.entity';

@Entity({ name: 'reservation_products' })
export class ReservationProductsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float', nullable: false })
    unitPrice: number;

    @Column({ type: 'int', nullable: false })
    qty: number;

    @Column({ type: 'float', nullable: false })
    totalPrice: number;

    // @ManyToOne(() => ReservationsEntity, (reservation) => reservation.products)
    // @JoinColumn({name: "reservationId"})
    // reservation: ReservationsEntity;

    @ManyToOne(() => ProductsEntity, (product) => product.reservation)
    @JoinColumn({name: "productId"})
    product: ProductsEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteddAt: Date;
}
