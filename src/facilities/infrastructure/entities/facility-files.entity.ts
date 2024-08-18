import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { FacilitiesEntity } from './facility.entity';

@Entity('facilities_files')
export class FacilityFilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FileEntity, (file) => file.facilities)
  @JoinColumn({name: "fileId"})
  file?: FileEntity;

  @ManyToOne(() => FacilitiesEntity, (facility) => facility.files)
  @JoinColumn({name: "facilityId"})
  facility: FacilitiesEntity;

  @Column({ type: String, nullable: true })
  altTag?: string;

  @Column({ default: false })
  isDefault: boolean;
}
