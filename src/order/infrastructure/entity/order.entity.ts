import { StatusEnum } from '../../../statuses/statuses.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
import { OrderProductsEntity } from './order-product.entity';
import { OrderStatusEnum } from 'src/order/enums/order-status.enum';

@Entity({ name: `orders` })
export class OrdersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'float', nullable: true})
  total: number;

  @Column({type: 'varchar', default: OrderStatusEnum.PENDING})
  orderStatus:  OrderStatusEnum;

  @Column({nullable: true})
  orderDate: Date;

  @Column({type: 'varchar', nullable: true})
  shippingAddress: string;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({name: 'userId'})
  user: UserEntity;

  @OneToMany(() => OrderProductsEntity, (products) => products.order)
  products: OrderProductsEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
 