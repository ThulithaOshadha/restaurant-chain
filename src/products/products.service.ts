import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomException } from 'src/exception/common-exception';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './domain/product';
import { ProductRepository } from './infrastructure/repositories/abstract-product.repository';
import { FilterProductDto } from './dto/filter-product.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const isNameExist = await this.findOne({
            name: createProductDto.name.trim(),
        });

        if (isNameExist && isNameExist.deletedAt === null) {
            throw new CustomException(
                'product name allready exist',
                HttpStatus.NOT_ACCEPTABLE,
            );
        }

        const product = {
            ...createProductDto,
        };

        return await this.productRepository.create(product);
    }

    findManyWithPagination({
        filterOptions, paginationOptions,
    }: {
        filterOptions?: FilterProductDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Product>> {
        return this.productRepository.findManyWithPagination({
            filterOptions,
            paginationOptions,
        });
    }

    findOne(fields: EntityCondition<Product>): Promise<NullableType<Product>> {
        return this.productRepository.findOne(fields);
    }

    async updateProductData(
        productId: string,
        updateData: UpdateProductDto,
    ): Promise<Product> {
        const existingProduct = await this.productRepository.findOne({
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

        const productDomain = {
            id: productId,
            ...updateData
        }
        return this.productRepository.updateProductData(productId, productDomain);
    }

    async softDelete(id: Product['id']): Promise<void> {
        await this.productRepository.softDelete(id);
    }

}
