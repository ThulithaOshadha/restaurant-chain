import { StatusEnum } from '../../../statuses/statuses.enum';
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
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
import { OrdersEntity } from './order.entity';
import { ProductsEntity } from 'src/products/infrastructure/entities/products.entity';

@Entity({ name: `order_product` })
export class OrderProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'int', nullable: true})
  qty: number;

  @Column({type: 'float', nullable: true})
  unitPrice: number;

  @ManyToOne(() => OrdersEntity, (order) => order.products)
  @JoinColumn({name: 'orderId'})
  order: OrdersEntity;

  @ManyToOne(() => ProductsEntity, (products) => products.orders)
  @JoinColumn({name: 'productId'})
  products: ProductsEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
 