import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { Role } from '../../domain/role';
import { NullableType } from '../../../utils/types/nullable.type';
import { FilterRoleDto, SortRoleDto } from '../../../roles/dto/query-role.dto';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';

export abstract class AbstractRoleRepository {
  abstract create(
    data: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Role>;

  abstract findOne(fields: EntityCondition<Role>): Promise<NullableType<Role>>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterRoleDto | null;
    sortOptions?: SortRoleDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Role>>;

  abstract update(
    id: number,
    updateData: Partial<
      Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Role>;

  abstract delete(id: number): Promise<boolean>;
}
