import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { ProductFilesEntity } from '../entities/product-files.entity';
import { ProductFile } from 'src/products/domain/product-files';
import { ProductsEntity } from '../entities/products.entity';

export class ProductFileMapper {
  static toDomain(raw: ProductFilesEntity): ProductFile {
    const product = new ProductFile();
    product.id = raw.file?.id;
    product.altTag = raw.altTag;
    product.isDefault = raw.isDefault;
    product.path = raw.file?.path;
    if (raw.product) {
      product.productId = raw.product;
    }

    return product;
  }

  static toPersistence(product: ProductFile): ProductFilesEntity {
    const productEntity = new ProductFilesEntity();
    if (product.id && typeof product.id === 'string') {
      productEntity.id = product.id;
    }
    let file = new FileEntity();
    if (product.file) {
      file = new FileEntity();
      file.id = product.file.id;
    }
    productEntity.file = file;

    let products = new ProductsEntity();
    if (product.productId) {
      products = new ProductsEntity();
      product.id = product.productId.id;
    }
    productEntity.product = products;
    return productEntity;
  }
}
