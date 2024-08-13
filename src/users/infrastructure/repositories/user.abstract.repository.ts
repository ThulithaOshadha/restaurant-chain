import { DeepPartial } from 'typeorm';
import { User } from '../../../users/domain/user';
import { FilterUserDto, SortUserDto } from '../../../users/dto/query-user.dto';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';

export abstract class UserAbstractRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<User>>;

  abstract findOne(
    fields: EntityCondition<User>,
    relations?: Array<string>,
  ): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract softDelete(id: User['id']): Promise<void>;

  abstract setUserBlackList(
    id: string,
    user: DeepPartial<User>,
  ): Promise<NullableType<User | null>>;

}
