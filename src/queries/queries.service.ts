import { HttpStatus, Injectable } from '@nestjs/common';
import { AbstractQueryRepository } from './infrstructure/reposiories/abstract-query.repository';
import { FilterQueryDto } from './dto/filter-query.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { QueryDomain } from './domain/query';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { UpdateQueryDto } from './dto/update-query.dto';
import { CustomException } from 'src/exception/common-exception';
import { CreateQueryDto } from './dto/create-query.dto';
import { UsersService } from '../users/users.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';

@Injectable()
export class QueriesService {
    constructor(private readonly queryRepository: AbstractQueryRepository, private readonly userService: UsersService) { }

    async create(createQueryDto: CreateQueryDto, userJwtPayload: JwtPayloadType): Promise<QueryDomain> {

        const user = await this.userService.findOne({ id: userJwtPayload.id })
        if (!user) {
            throw new CustomException('user not exist', HttpStatus.NOT_FOUND)
        }
        const queryDomain = {
            user: user,
            ...createQueryDto,
        };
        return await this.queryRepository.create(queryDomain);

    }

    async findOne(fields: EntityCondition<QueryDomain>): Promise<NullableType<QueryDomain>> {
        return await this.queryRepository.findOne(fields);
    }

    findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterQueryDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<QueryDomain>> {
        return this.queryRepository.findManyWithPagination({
            filterOptions,
            paginationOptions,
        });
    }

    async update(id: string, updateCityDto: UpdateQueryDto): Promise<QueryDomain> {
        
        const isExistCity = await this.findOne({ id });
        
        if (!isExistCity) {
            throw new CustomException('query does not exist', HttpStatus.NOT_FOUND);
        }
        isExistCity.response = updateCityDto.response;

        return this.queryRepository.update(id, isExistCity);
    }
    async delete(id: string): Promise<void> {
        return this.queryRepository.softDelete(id);
    }
}
