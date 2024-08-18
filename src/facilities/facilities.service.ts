import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomException } from 'src/exception/common-exception';
import { Facility } from './domain/facility';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { FilterFacilityDto } from './dto/filter-facility.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { AbstractFacilitiesRepository } from './infrastructure/repositories/abstract-facility.repository';

@Injectable()
export class FacilitiesService {

    constructor(
        private readonly facilityRepository: AbstractFacilitiesRepository,
    ) { }

    async create(createProductDto: CreateFacilityDto): Promise<Facility> {
        const isNameExist = await this.findOne({
            name: createProductDto.name.trim(),
        });

        if (isNameExist && isNameExist.deletedAt === null) {
            throw new CustomException(
                'Facility name allready exist',
                HttpStatus.NOT_ACCEPTABLE,
            );
        }

        const facility = {
            ...createProductDto,
        };

        return await this.facilityRepository.create(facility);
    }

    findManyWithPagination({
        filterOptions, paginationOptions,
    }: {
        filterOptions?: FilterFacilityDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Facility>> {
        return this.facilityRepository.findManyWithPagination({
            filterOptions,
            paginationOptions,
        });
    }

    findOne(fields: EntityCondition<Facility>): Promise<NullableType<Facility>> {
        return this.facilityRepository.findOne(fields);
    }

    async updateProductData(
        productId: string,
        updateData: UpdateFacilityDto,
    ): Promise<Facility> {
        const existingProduct = await this.facilityRepository.findOne({
            id: productId,
        });
        if (!existingProduct) {
            throw new CustomException('Facility not found', HttpStatus.NOT_FOUND);
        }

        if (existingProduct.name !== updateData.name) {
            const productbyName = await this.findOne({ name: updateData.name });
            if (productbyName && productbyName.id !== existingProduct.id) {
                throw new CustomException(
                    'Facility name allready exist',
                    HttpStatus.CONFLICT,
                );
            }
        }

        const facilityDomain = {
            id: productId,
            ...updateData
        }
        return this.facilityRepository.update(productId, facilityDomain);
    }

    async softDelete(id: Facility['id']): Promise<void> {
        await this.facilityRepository.softDelete(id);
    }
}
