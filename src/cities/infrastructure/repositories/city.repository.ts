import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { AbstractCityRepository } from './abstract-city.repository';
import { City } from '../../../cities/domain/city.domain';
import { FilterCityDto, SortCityDto } from '../../../cities/dto/query-city.dto';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { CityMapper } from '../mappers/city.mapper';
import { CustomException } from '../../../exception/common-exception';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { CitiesEntity } from '../entity/city.entity';

@Injectable()
export class CityRepository implements AbstractCityRepository {
  constructor(
    @InjectRepository(CitiesEntity)
    private readonly cityRepository: Repository<CitiesEntity>,
    private dataSource: DataSource,
  ) {}
  async create(data: City): Promise<City> {
    const persistenceModel = CityMapper.toPersistence(data);

    const newEntity = await this.cityRepository.save(
      this.cityRepository.create(persistenceModel),
    );
    return CityMapper.toDomain(newEntity);
  }
  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCityDto | null | undefined;
    sortOptions?: SortCityDto[] | null | undefined;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<City>> {
    const where: FindOptionsWhere<CitiesEntity> = {};

    if (filterOptions?.name?.length) {
      where.name = ILike(`%${filterOptions.name}%`);
    }
    const totalRecords = await this.cityRepository.count({ where });
    const entities = await this.cityRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    const records =  entities.map((city) => CityMapper.toDomain(city));
    return {
      data: records,
      currentPage: paginationOptions.page,
      totalRecords: totalRecords,
      hasNextPage: records.length === paginationOptions.limit,
    };
  }
  async findOne(fields: EntityCondition<City>): Promise<NullableType<City>> {
    const entity = await this.cityRepository.findOne({
      where: fields as FindOptionsWhere<CitiesEntity>,
    });

    return entity ? CityMapper.toDomain(entity) : null;
  }
  async updateCitytData(
    cityId: string,
    updateData: Partial<City>,
  ): Promise<City> {
    const isExistCity = await this.findOne({ id: cityId });
    if (!isExistCity) {
      throw new CustomException(
        'throw new custome exception',
        HttpStatus.NOT_FOUND,
      );
    }

    const updateEntity = await this.cityRepository.save(updateData);
    return CityMapper.toDomain(updateEntity);
  }

  async softDelete(id: string): Promise<void> {
    await this.cityRepository.softDelete(id);
  }
}
