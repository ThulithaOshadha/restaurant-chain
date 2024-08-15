import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { ProductRelationalRepository } from './repositories/product.repository';
import { FilesModule } from '../../files/files.module';
import { ProductFilesEntity } from './entities/product-files.entity';
import { ProductsEntity } from './entities/products.entity';
import { ProductRepository } from './repositories/abstract-product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      ProductFilesEntity,
    ]),
    forwardRef(() => FilesModule),
  ],
  providers: [
    {
      provide: ProductRepository,
      useClass: ProductRelationalRepository,
    },
  ],
  exports: [ProductRepository],
})
export class ProductPersistenceModule {}
