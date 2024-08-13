import { PermissionEntity } from 'src/permission/infrastructure/persistence/relational/entities/permission.entity';
import { RolePermission } from 'src/role-permission/domain/role-permission';
import { RoleEntity } from 'src/roles/infrastructure/entities/role.entity';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'role_permission',
})
export class RolePermissionEntity
  extends EntityRelationalHelper
  implements RolePermission
{
  
 
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => RoleEntity, (role) => role.rolePermission)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.rolePermission)
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;
  @Column({ type: Number, default: StatusEnum.active })
  status: StatusEnum;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
