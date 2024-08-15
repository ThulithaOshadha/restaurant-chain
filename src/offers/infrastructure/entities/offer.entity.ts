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
import { OfferFilesEntity } from './offer-files.entity';

@Entity({ name: 'offers' })
export class OffersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: String, nullable: false})
  name: string;

  @Column({type: 'float', nullable: true})
  price: number;

  @Column({type: 'text', nullable: true})
  description: string;

  @Column({ default: StatusEnum.active })
  status: StatusEnum;

  @Column({type: Number, nullable: true})
  discountPercentage?: number;

  @Column({type: Date, nullable: true})
  startDate?: Date | null;

  @Column({type: Date, nullable: true})
  endDate?: Date | null;

  @OneToMany(() => OfferFilesEntity, (ppf) => ppf.offer)
  files?: OfferFilesEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
