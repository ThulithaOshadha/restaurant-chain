import { RolePermissionEntity } from 'src/role-permission/infrastructure/persistance/entities/role-permission.entity';
import { Role } from 'src/roles/domain/role';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'role',
})
export class RoleEntity extends EntityRelationalHelper implements Role {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: String })
  name: string;
  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.role,
  )
  rolePermission: RolePermissionEntity;
  @OneToMany(() => UserEntity, (user) => user.role)
  user: UserEntity | null;
  @Column({ default: StatusEnum.active })
  status: StatusEnum;
  @Column({ default: false })
  isDefault: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
