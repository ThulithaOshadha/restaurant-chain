import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsEntity } from "../entities/products.entity";
import { DataSource, FindOptionsWhere, ILike, QueryRunner, Repository } from "typeorm";
import { ProductFilesEntity } from "../entities/product-files.entity";
import { ProductRepository } from "./abstract-product.repository";
import { FilesService } from "src/files/files.service";
import { Product } from "src/products/domain/product";
import { FilterProductDto } from "src/products/dto/filter-product.dto";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { NullableType } from "src/utils/types/nullable.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { ProductMapper } from "../mappers/product-mapper";
import { CustomException } from "src/exception/common-exception";
import { FileEntity } from "src/files/infrastructure/persistence/relational/entities/file.entity";

@Injectable()
export class ProductRelationalRepository implements ProductRepository {
    constructor(
        @InjectRepository(ProductsEntity)
        private readonly productRepository: Repository<ProductsEntity>,
        @InjectRepository(ProductFilesEntity)
        private readonly productFileRepository: Repository<ProductFilesEntity>,
        private dataSource: DataSource,
        private readonly fileService: FilesService,
    ) { }

    async create(data: Product): Promise<Product> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();

            const persistenceModel = ProductMapper.toPersistence(data);

            const newEntity = await queryRunner.manager.save(
                ProductsEntity,
                persistenceModel,
            );
            const fileArray: any = [];
            if (data.files?.length) {
                for (let file of data.files) {
                    const fileEntity = await this.createProductFile(
                        newEntity.id,
                        file.id!,
                        file.altTag!,
                        file.isDefault!,
                        queryRunner,
                    );
                    fileArray.push(fileEntity);
                }
            }
            await queryRunner.commitTransaction();
            newEntity.files = fileArray;
            return ProductMapper.toDomain(newEntity);
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new CustomException(`${error.message}`, HttpStatus.UNPROCESSABLE_ENTITY);
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }

    async createProductFile(
        productId: string,
        fileId: string,
        altTag: string,
        isDefault: boolean,
        queryRunner: QueryRunner,
    ): Promise<ProductFilesEntity> {
        const productFile = this.productFileRepository.create({
            file: { id: fileId } as FileEntity,
            product: { id: productId } as ProductsEntity,
            altTag: altTag,
            isDefault: isDefault,
        });

        const productFileEntity = await queryRunner.manager.save(
            ProductFilesEntity,
            productFile,
        );
        return productFileEntity;
    }

    async findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterProductDto | null | undefined;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Product>> {
        const where: FindOptionsWhere<ProductsEntity> = {};
        if (filterOptions?.name?.length) {
            where.name = ILike(`%${filterOptions.name}%`);
        }

        if (filterOptions?.status) {
            where.status = filterOptions.status;
        }

        const totalRecords = await this.productRepository.count({ where });

        paginationOptions.totalRecords = totalRecords;
        const entities = await this.productRepository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            // relations: ['files.file', 'subProducts'],
            relations: {
                files: { file: true },
            },

            order: {
                updatedAt: 'DESC',
            },
        });
        const records = entities.map((product) => ProductMapper.toDomain(product));

        return {
            data: records,
            currentPage: paginationOptions.page,
            totalRecords: totalRecords,
            hasNextPage: records.length === paginationOptions.limit,
        };
    }
    async findOne(fields: EntityCondition<Product>): Promise<NullableType<Product>> {
        const entity = await this.productRepository.findOne({
            where: fields as FindOptionsWhere<ProductsEntity>,
            relations: {
                files: { file: true },
            },
        });

        return entity ? ProductMapper.toDomain(entity) : null;
    }
    async updateProductData(productId: string, updateData: Product): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new CustomException('Product not found', HttpStatus.NOT_FOUND);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.startTransaction();

            if (updateData.files && updateData.files.length > 0) {
                for (const file of updateData.files) {
                    const isAlreadyAssigned = await this.checkIsFileAlreadyAssignned(
                        productId,
                        file?.id!,
                    );

                    if (isAlreadyAssigned) {
                        continue;
                    }
                    if (!isAlreadyAssigned) {
                        await this.createProductFile(
                            productId,
                            file.id!,
                            file.altTag!,
                            file.isDefault!,
                            queryRunner,
                        );
                    }
                }

                //await this.deleteUselessProductFiles(productId, updateData.files);
            }

            const persistenceModel = ProductMapper.toPersistence(updateData);
            const updatedEntity = await queryRunner.manager.save(
                ProductsEntity,
                persistenceModel,
            );

            await queryRunner.commitTransaction();

            return ProductMapper.toDomain(updatedEntity);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async checkIsFileAlreadyAssignned(
        productId: string,
        fileId: string,
    ): Promise<boolean> {
        const entity = await this.productFileRepository.findOne({
            where: {
                file: { id: fileId },
                product: { id: productId },
            },
        });

        if (!entity) {
            return false;
        }
        return true;
    }

    async softDelete(id: Product["id"]): Promise<void> {
        await this.productRepository.softDelete(id!);
    }
}