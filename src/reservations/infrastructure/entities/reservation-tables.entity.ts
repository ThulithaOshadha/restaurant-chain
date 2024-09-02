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
import { RestuarantTablesEntity } from './tables.entity';

@Entity({ name: 'reservation_tables' })
export class ReservationTablesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ReservationsEntity, (reservation) => reservation.resTtables)
    @JoinColumn({ name: "reservationId" })
    reservation: ReservationsEntity;

    @ManyToOne(() => RestuarantTablesEntity, (table) => table.reservation)
    @JoinColumn({ name: `tableId` })
    table: RestuarantTablesEntity;

    @Column({ type: 'varchar' ,nullable: true})
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteddAt: Date;
}
