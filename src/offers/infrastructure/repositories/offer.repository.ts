import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, ILike, QueryRunner, Repository } from "typeorm";
import { FilesService } from "src/files/files.service";
import { Product } from "src/products/domain/product";
import { FilterProductDto } from "src/products/dto/filter-product.dto";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { NullableType } from "src/utils/types/nullable.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { CustomException } from "src/exception/common-exception";
import { FileEntity } from "src/files/infrastructure/persistence/relational/entities/file.entity";
import { OffersAbstractRepository } from "./abstract-offer.repository";
import { Offer } from "src/offers/domain/offer";
import { OffersEntity } from "../entities/offer.entity";
import { OfferFilesEntity } from "../entities/offer-files.entity";
import { OfferMapper } from "../mappers/offer.mapper";

@Injectable()
export class OffersRepository implements OffersAbstractRepository {
    constructor(
        @InjectRepository(OffersEntity)
        private readonly offerRepository: Repository<OffersEntity>,
        @InjectRepository(OfferFilesEntity)
        private readonly offerFileRepository: Repository<OfferFilesEntity>,
        private dataSource: DataSource,
        private readonly fileService: FilesService,
    ) { }

    async create(data: Offer): Promise<Offer> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();

            const persistenceModel = OfferMapper.toPersistence(data);

            const newEntity = await queryRunner.manager.save(
                OffersEntity,
                persistenceModel,
            );
            const fileArray: any = [];
            if (data.files?.length) {
                for (let file of data.files) {
                    const fileEntity = await this.createOfferFile(
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
            return OfferMapper.toDomain(newEntity);
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new CustomException(`${error.message}`, HttpStatus.UNPROCESSABLE_ENTITY);
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }

    async createOfferFile(
        offerId: string,
        fileId: string,
        altTag: string,
        isDefault: boolean,
        queryRunner: QueryRunner,
    ): Promise<OfferFilesEntity> {
        const offerFile = this.offerFileRepository.create({
            file: { id: fileId } as FileEntity,
            offer: { id: offerId } as OffersEntity,
            altTag: altTag,
            isDefault: isDefault,
        });

        const productFileEntity = await queryRunner.manager.save(
            OfferFilesEntity,
            offerFile,
        );
        return productFileEntity;
    }

    async findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterProductDto | null | undefined;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Offer>> {
        const where: FindOptionsWhere<OffersEntity> = {};
        if (filterOptions?.name?.length) {
            where.name = ILike(`%${filterOptions.name}%`);
        }

        if (filterOptions?.status) {
            where.status = filterOptions.status;
        }

        const totalRecords = await this.offerRepository.count({ where });

        paginationOptions.totalRecords = totalRecords;
        const entities = await this.offerRepository.find({
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
        const records = entities.map((offer) => OfferMapper.toDomain(offer));

        return {
            data: records,
            currentPage: paginationOptions.page,
            totalRecords: totalRecords,
            hasNextPage: records.length === paginationOptions.limit,
        };
    }
    async findOne(fields: EntityCondition<Offer>): Promise<NullableType<Offer>> {
        const entity = await this.offerRepository.findOne({
            where: fields as FindOptionsWhere<OffersEntity>,
            relations: {
                files: { file: true },
            },
        });

        return entity ? OfferMapper.toDomain(entity) : null;
    }
    async updateOfferData(productId: string, updateData: Product): Promise<Product> {
        const product = await this.offerRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new CustomException('Offer not found', HttpStatus.NOT_FOUND);
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
                        await this.createOfferFile(
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

            const persistenceModel = OfferMapper.toPersistence(updateData);
            const updatedEntity = await queryRunner.manager.save(
                OffersEntity,
                persistenceModel,
            );

            await queryRunner.commitTransaction();

            return OfferMapper.toDomain(updatedEntity);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async checkIsFileAlreadyAssignned(
        offerId: string,
        fileId: string,
    ): Promise<boolean> {
        const entity = await this.offerFileRepository.findOne({
            where: {
                file: { id: fileId },
                offer: { id: offerId },
            },
        });

        if (!entity) {
            return false;
        }
        return true;
    }

    async softDelete(id: Offer["id"]): Promise<void> {
        await this.offerRepository.softDelete(id!);
    }
}