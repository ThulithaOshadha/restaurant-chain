import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FacilityFilesEntity } from '../entities/facility-files.entity';
import { ProductFile } from 'src/products/domain/product-files';
import { FacilitiesEntity } from '../entities/facility.entity';
import { FacilityFile } from 'src/facilities/domain/facility-files';

export class FacilityFileMapper {
  static toDomain(raw: FacilityFilesEntity): FacilityFile {
    const product = new FacilityFile();
    product.id = raw.file?.id;
    product.altTag = raw.altTag;
    product.isDefault = raw.isDefault;
    product.path = raw.file?.path;
    if (raw.facility) {
      product.facilityId = raw.facility;
    }

    return product;
  }

  static toPersistence(facilityFile: FacilityFile): FacilityFilesEntity {
    const productEntity = new FacilityFilesEntity();
    if (facilityFile.id && typeof facilityFile.id === 'string') {
      productEntity.id = facilityFile.id;
    }
    let file = new FileEntity();
    if (facilityFile.file) {
      file = new FileEntity();
      file.id = facilityFile.file.id;
    }
    productEntity.file = file;

    let facilities = new FacilitiesEntity();
    if (facilityFile.facilityId) {
      facilities = new FacilitiesEntity();
      facilities.id = facilityFile.facilityId.id!;
    }
    productEntity.facility = facilities;
    return productEntity;
  }
}
