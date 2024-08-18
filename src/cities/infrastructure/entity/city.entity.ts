import { StatusEnum } from '../../../statuses/statuses.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cities' })
export class CitiesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', nullable: true })
  lat?: number;

  @Column({ type: 'decimal', nullable: true })
  lang?: number;

  @Column({ nullable: true, type: 'json' })
  mapObject?: string;

  @Column({ default: StatusEnum.active })
  status?: StatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteddAt: Date;
}
