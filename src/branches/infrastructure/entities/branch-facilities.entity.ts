import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BranchesEntity } from './braches.entity';
import { FacilitiesEntity } from 'src/facilities/infrastructure/entities/facility.entity';

@Entity('branch_faciliies')
export class BranchFacilitiesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FacilitiesEntity, (facility) => facility.branch)
  @JoinColumn({name: "facilityId"})
  facility?: FacilitiesEntity;

  @ManyToOne(() => BranchesEntity, (branch) => branch.files)
  @JoinColumn({name: "branchId"})
  branch: BranchesEntity;

  
}
