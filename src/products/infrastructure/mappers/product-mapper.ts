import { Product } from '../../domain/product';
import { ProductsEntity } from '../entities/products.entity';
import { ProductFileMapper } from './product-files.mapper';
export class ProductMapper {
    static toDomain(raw: ProductsEntity): Product {
        const product = new Product();

        product.id = raw.id;
        product.name = raw.name;
        product.status = raw.status;
        if (raw.files && raw.files.length) {
            product.files = raw.files.map((file) => ProductFileMapper.toDomain(file));
        }
        product.price = raw.price;
        product.description = raw.description;
        product.createdAt = raw.createdAt;
        product.updatedAt = raw.updatedAt;
        product.deletedAt = raw.deletedAt;
        return product;
    }

    static toPersistence(product: Product): ProductsEntity {
        const productEntity = new ProductsEntity();
        if (product.id && typeof product.id === 'string') {
            productEntity.id = product.id;
        }
        productEntity.price = product.price;
        productEntity.name = product.name;
        productEntity.description = product.description ? product.description : '';
        productEntity.status = product.status!;
        return productEntity;
    }
}
