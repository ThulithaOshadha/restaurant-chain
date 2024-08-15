import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { CustomException } from '../../../exception/common-exception';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { AbstractQueryRepository } from './abstract-query.repository';
import { QueryEntity } from '../entities/query.entity';
import { QueryDomain } from 'src/queries/domain/query';
import { QueryMapper } from '../mappers/query.mapper';
import { FilterQueryDto } from 'src/queries/dto/filter-query.dto';

@Injectable()
export class QueryRepository implements AbstractQueryRepository {
    constructor(
        @InjectRepository(QueryEntity)
        private readonly repository: Repository<QueryEntity>,
    ) { }
    async create(data: QueryDomain): Promise<QueryDomain> {
        const persistenceModel = QueryMapper.toPersistence(data);

        const newEntity = await this.repository.save(
            this.repository.create(persistenceModel),
        );
        return QueryMapper.toDomain(newEntity);
    }
    async findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterQueryDto | null | undefined;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<QueryDomain>> {
        const where: FindOptionsWhere<QueryEntity> = {};

        if (filterOptions?.customerName) {
            where.user = { firstName: ILike(`%${filterOptions.customerName}%`) };
        }
        const totalRecords = await this.repository.count({ where });
        const entities = await this.repository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            relations: { user: true },
            order:
                { updatedAt: 'ASC' },
        });

        const records = entities.map((query) => QueryMapper.toDomain(query));
        return {
            data: records,
            currentPage: paginationOptions.page,
            totalRecords: totalRecords,
            hasNextPage: records.length === paginationOptions.limit,
        };
    }
    async findOne(fields: EntityCondition<QueryDomain>): Promise<NullableType<QueryDomain>> {
        const entity = await this.repository.findOne({
            where: fields as FindOptionsWhere<QueryEntity>,
            relations: { user: true }
        });
        return entity ? QueryMapper.toDomain(entity) : null;
    }
    async update(
        id: string,
        updateData: Partial<QueryDomain>,
    ): Promise<QueryDomain> {
        const isExistCity = await this.findOne({ id });
        if (!isExistCity) {
            throw new CustomException(
                'query does not exist',
                HttpStatus.NOT_FOUND,
            );
        }
        isExistCity.response = updateData.response;

        const updateEntity = await this.repository.save(QueryMapper.toPersistence(isExistCity));
        return isExistCity;
    }

    async softDelete(id: string): Promise<void> {
        await this.repository.softDelete(id);
    }
}
