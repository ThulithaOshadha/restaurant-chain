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
import { FacilityFilesEntity } from './facility-files.entity';
import { BranchesEntity } from 'src/branches/infrastructure/entities/braches.entity';
import { BranchFacilitiesEntity } from 'src/branches/infrastructure/entities/branch-facilities.entity';

@Entity({ name: 'facilities' })
export class FacilitiesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: StatusEnum.active })
  status: StatusEnum;

  @OneToMany(() => FacilityFilesEntity, (ppf) => ppf.facility)
  files?: FacilityFilesEntity[];

  @OneToMany(() => BranchFacilitiesEntity, (branch) => branch.facility)
  branch?: BranchFacilitiesEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
