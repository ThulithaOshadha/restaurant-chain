import { BranchesEntity } from 'src/branches/infrastructure/entities/braches.entity';
import { StatusEnum } from '../../../statuses/statuses.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
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

  @OneToOne(() => BranchesEntity, (branch) => branch.city)
  branch:BranchesEntity; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteddAt: Date;
}
