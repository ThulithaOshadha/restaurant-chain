import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CustomException } from 'src/exception/common-exception';
import { Offer } from './domain/offer';
import { FilterOfferDto } from './dto/filter-offer.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OffersAbstractRepository } from './infrastructure/repositories/abstract-offer.repository';

@Injectable()
export class OffersService {

    constructor(
        private readonly offerRepository: OffersAbstractRepository,
    ) { }

    async create(createProductDto: CreateOfferDto): Promise<Offer> {
        const isNameExist = await this.findOne({
            name: createProductDto.name.trim(),
        });

        if (isNameExist && isNameExist.deletedAt === null) {
            throw new CustomException(
                'product name allready exist',
                HttpStatus.NOT_ACCEPTABLE,
            );
        }

        const offer = {
            ...createProductDto,
        };

        return await this.offerRepository.create(offer);
    }

    findManyWithPagination({
        filterOptions, paginationOptions,
    }: {
        filterOptions?: FilterOfferDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Offer>> {
        return this.offerRepository.findManyWithPagination({
            filterOptions,
            paginationOptions,
        });
    }

    findOne(fields: EntityCondition<Offer>): Promise<NullableType<Offer>> {
        return this.offerRepository.findOne(fields);
    }

    async update(
        productId: string,
        updateData: UpdateOfferDto,
    ): Promise<Offer> {
        const existingProduct = await this.offerRepository.findOne({
            id: productId,
        });
        if (!existingProduct) {
            throw new CustomException('product not found', HttpStatus.NOT_FOUND);
        }

        if (existingProduct.name !== updateData.name) {
            const productbyName = await this.findOne({ name: updateData.name });
            if (productbyName && productbyName.id !== existingProduct.id) {
                throw new CustomException(
                    'product name allready exist',
                    HttpStatus.CONFLICT,
                );
            }
        }

        const offerDomain = {
            id: productId,
            ...updateData
        }
        return this.offerRepository.updateOfferData(productId, offerDomain);
    }

    async softDelete(id: Offer['id']): Promise<void> {
        await this.offerRepository.softDelete(id);
    }
}
