import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { OffersEntity } from './offer.entity';

@Entity('offers_files')
export class OfferFilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FileEntity, (file) => file.products)
  file?: FileEntity;

  @ManyToOne(() => OffersEntity, (offer) => offer.files)
  offer: OffersEntity;

  @Column({ type: String, nullable: true })
  altTag?: string;

  @Column({ default: false })
  isDefault: boolean;
}
