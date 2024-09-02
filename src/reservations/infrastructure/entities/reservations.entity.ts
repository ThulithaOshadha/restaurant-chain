import { ReservationStatusEnum } from 'src/statuses/reservation-status.enum';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
import { BranchesEntity } from 'src/branches/infrastructure/entities/braches.entity';
import { ReservationProductsEntity } from './reservation_products.entity';
import { ReservationTablesEntity } from './reservation-tables.entity';

@Entity({ name: 'reservations' })
export class ReservationsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float', nullable: false })
    total: number;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'int', nullable: true })
    personCount?: number;

    @Column({ nullable: true })
    reservationDate?: Date;

    @Column({ default: ReservationStatusEnum.pending })
    status?: ReservationStatusEnum;

    @ManyToOne(() => UserEntity, (user) => user.reservation)
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @ManyToOne(() => BranchesEntity, (branch) => branch.reservation ,{nullable: true})
    @JoinColumn({ name: "branchId"})
    branch: BranchesEntity;

    // @OneToMany(() => ReservationProductsEntity, (reservationsProduct) => reservationsProduct.reservation)
    // products: ReservationProductsEntity[];

    @OneToMany(() => ReservationTablesEntity, (resTtables) => resTtables.reservation)
    resTtables: ReservationTablesEntity[];

    @CreateDateColumn()
    createdAt: Date; 

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteddAt: Date;
}
