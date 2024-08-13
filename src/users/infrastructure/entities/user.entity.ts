import { Exclude, Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { AuthProvidersEnum } from '../../../auth/auth-providers.enum';
import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { StatusEntity } from '../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { EntityRelationalHelper } from '../../../utils/relational-entity-helper';
import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { RoleEntity } from 'src/roles/infrastructure/entities/role.entity';


@Entity({
  name: 'user',
})
@Unique(['email', 'contactNo'])
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, unique: true, nullable: true })
  @IsEmail()
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['customer', 'superAdmin', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  contactNo: string | null;

  // @Column({ type: String, nullable: true })
  // address: string | null;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @ManyToOne(() => RoleEntity, (role) => role.user)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
