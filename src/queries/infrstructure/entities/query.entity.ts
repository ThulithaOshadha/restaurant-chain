import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
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

@Entity({ name: 'query' })
export class QueryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text', nullable: false})
  queryText: string;

  @Column({type: 'text', nullable: true})
  response: string | null;

  @ManyToOne(() => UserEntity, (user) => user.query)
  @JoinColumn({name: "userId"})
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteddAt: Date;
}
