import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { ProductsEntity } from './products.entity';

@Entity('products_files')
export class ProductFilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FileEntity, (file) => file.products)
  @JoinColumn({name: "fileId"})
  file?: FileEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.files)
  @JoinColumn({name: "productId"})
  product: ProductsEntity;

  @Column({ type: String, nullable: true })
  altTag?: string;

  @Column({ default: false })
  isDefault: boolean;
}
