import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterLoad,
  AfterInsert,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import appConfig from '../../../../../config/app.config';
import { AppConfig } from 'src/config/app-config.type';
import { GalleryFilesEntity } from 'src/gallery/infrastructure/entities/gallery-files.entity';
import { ProductFilesEntity } from '../../../../../products/infrastructure/entities/product-files.entity';
import { FacilityFilesEntity } from 'src/facilities/infrastructure/entities/facility-files.entity';
import { OfferFilesEntity } from 'src/offers/infrastructure/entities/offer-files.entity';

@Entity({ name: 'file' })
export class FileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @OneToMany(() => GalleryFilesEntity, (gallery) => gallery.file)
  gallery: GalleryFilesEntity;

  @OneToMany(() => ProductFilesEntity, (ppf) => ppf.file)
  products: ProductFilesEntity[];

  @OneToMany(() => OfferFilesEntity, (ofersFile) => ofersFile.file)
  offers: OfferFilesEntity[];

  @OneToMany(() => FacilityFilesEntity, (facilitiesFileFile) => facilitiesFileFile.file)
  facilities: FacilityFilesEntity[];

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = (appConfig() as AppConfig).backendDomain + this.path;
    }
  }
}
