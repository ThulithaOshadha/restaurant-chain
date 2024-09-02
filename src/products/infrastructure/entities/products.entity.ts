import { StatusEnum } from '../../../statuses/statuses.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductFilesEntity } from './product-files.entity';
import { ReservationProductsEntity } from 'src/reservations/infrastructure/entities/reservation_products.entity';
import { OrderProductsEntity } from 'src/order/infrastructure/entity/order-product.entity';

@Entity({ name: 'products' })
export class ProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, nullable: false })
  name: string;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: StatusEnum.active })
  status: StatusEnum;

  @OneToMany(() => ProductFilesEntity, (ppf) => ppf.product)
  files?: ProductFilesEntity[];

  @OneToMany(() => ReservationProductsEntity, (reservation) => reservation.product)
  reservation?: ReservationProductsEntity[];

  @OneToMany(() => OrderProductsEntity, (orders) => orders.products)
  orders: OrderProductsEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
