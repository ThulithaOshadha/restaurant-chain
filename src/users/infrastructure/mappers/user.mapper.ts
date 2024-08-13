import { User } from '../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { StatusEntity } from '../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileMapper } from '../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { RoleEntity } from '../../../roles/infrastructure/entities/role.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id;
    user.email = raw.email;
    user.password = raw.password;
    user.provider = raw.provider;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    if (raw.photo) {
      user.photo = FileMapper.toDomain(raw.photo);
    }
    user.role = raw.role;
    user.status = raw.status;
    user.contactNo = raw.contactNo;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    user.deletedAt = raw.deletedAt;
    return user;
  }

  static toPersistence(user: User): UserEntity {
    let role;
    if (user.role) {
      role = new RoleEntity();
      role.id = user.role.id;
    }

    let photo: FileEntity | undefined = undefined;

    if (user.photo) {
      photo = new FileEntity();
      photo.id = user.photo.id;
    }

    let status: StatusEntity | undefined = undefined;

    if (user.status) {
      status = new StatusEntity();
      status.id = user.status.id;
    }

    const userEntity = new UserEntity();
    if (user.id && typeof user.id === 'string') {
      userEntity.id = user.id;
    }
    userEntity.id = user.id;
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.provider = user.provider!;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.photo = photo;
    userEntity.role = role;
    userEntity.status = status;
    userEntity.contactNo = user.contactNo;
    userEntity.createdAt = user.createdAt!;
    userEntity.updatedAt = user.updatedAt!;
    userEntity.deletedAt = user.deletedAt!;
    return userEntity;
  }
}
