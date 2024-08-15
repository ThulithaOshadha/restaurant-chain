
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GalleryEntity } from './gallery.entity';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';

@Entity({ name: 'gallery_files' })
export class GalleryFilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type : Boolean, default: false})
  isDefault: boolean;

  @ManyToOne(() => GalleryEntity, (gallery) => gallery.file)
  @JoinColumn({name: "galleryId"})
  gallery: GalleryEntity;

  @ManyToOne(() => FileEntity, (file) => file.gallery)
  @JoinColumn({name: "fileId"})
  file: FileEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteddAt: Date;
}
