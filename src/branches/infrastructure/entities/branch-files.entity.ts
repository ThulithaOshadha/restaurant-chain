import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { BranchesEntity } from './braches.entity';

@Entity('branches_files')
export class BranchFilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FileEntity, (file) => file.branches)
  @JoinColumn({name: "fileId"})
  file?: FileEntity;

  @ManyToOne(() => BranchesEntity, (branch) => branch.files)
  @JoinColumn({name: "branchId"})
  branch: BranchesEntity;

  @Column({ type: String, nullable: true })
  altTag?: string;

  @Column({ default: false })
  isDefault: boolean;
}
