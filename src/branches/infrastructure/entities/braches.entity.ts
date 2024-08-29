import { StatusEnum } from '../../../statuses/statuses.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchFilesEntity } from './branch-files.entity';
import { CitiesEntity } from 'src/cities/infrastructure/entity/city.entity';
import { ReservationsEntity } from 'src/reservations/infrastructure/entities/reservations.entity';
import { BranchFacilitiesEntity } from './branch-facilities.entity';

@Entity({ name: 'branches' })
export class BranchesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: StatusEnum.active })
  status: StatusEnum;

  @OneToMany(() => BranchFilesEntity, (ppf) => ppf.branch)
  files?: BranchFilesEntity[];

  @OneToMany(() => BranchFacilitiesEntity, (ppf) => ppf.branch)
  facility?: BranchFacilitiesEntity[];

  @OneToOne(() => CitiesEntity, (city) => city.branch)
  @JoinColumn({ name: "cityId" })
  city: CitiesEntity;

  @OneToMany(() => ReservationsEntity, (reservation) => reservation.branch)
  reservation: ReservationsEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
