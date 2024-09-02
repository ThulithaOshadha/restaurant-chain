import { BranchesEntity } from 'src/branches/infrastructure/entities/braches.entity';
import { StatusEnum } from '../../../statuses/statuses.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReservationTablesEntity } from './reservation-tables.entity';

@Entity({ name: `tables` })
export class RestuarantTablesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: true })
  personCount?: number;

  @OneToMany(() => ReservationTablesEntity, (reservation) => reservation.table)
  reservation: ReservationTablesEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteddAt: Date;
}
