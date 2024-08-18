import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, ILike, QueryRunner, Repository } from "typeorm";
import { AbstractFacilitiesRepository } from "./abstract-facility.repository";
import { FilesService } from "src/files/files.service";
import { FilterProductDto } from "src/products/dto/filter-product.dto";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { NullableType } from "src/utils/types/nullable.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { FacilityMapper } from "../mappers/facility.mapper";
import { CustomException } from "src/exception/common-exception";
import { FileEntity } from "src/files/infrastructure/persistence/relational/entities/file.entity";
import { FacilitiesEntity } from "../entities/facility.entity";
import { FacilityFilesEntity } from "../entities/facility-files.entity";
import { Facility } from "src/facilities/domain/facility";

@Injectable()
export class FacilitiesRepository implements AbstractFacilitiesRepository {
    constructor(
        @InjectRepository(FacilitiesEntity) 
        private readonly facilityRepository: Repository<FacilitiesEntity>,
        @InjectRepository(FacilityFilesEntity)
        private readonly facilityFileRepository: Repository<FacilityFilesEntity>,
        private dataSource: DataSource,
        private readonly fileService: FilesService,
    ) { }

    async create(data: Facility): Promise<Facility> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();

            const persistenceModel = FacilityMapper.toPersistence(data);

            const newEntity = await queryRunner.manager.save(
                FacilitiesEntity,
                persistenceModel,
            );
            const fileArray: any = [];
            if (data.files?.length) {
                for (let file of data.files) {
                    const fileEntity = await this.createFacilityFile(
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
            return FacilityMapper.toDomain(newEntity);
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new CustomException(`${error.message}`, HttpStatus.UNPROCESSABLE_ENTITY);
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }

    async createFacilityFile(
        facilityId: string,
        fileId: string,
        altTag: string,
        isDefault: boolean,
        queryRunner: QueryRunner,
    ): Promise<FacilityFilesEntity> {
        const productFile = this.facilityFileRepository.create({
            file: { id: fileId } as FileEntity,
            facility: { id: facilityId } as FacilitiesEntity,
            altTag: altTag,
            isDefault: isDefault,
        });

        const productFileEntity = await queryRunner.manager.save(
            FacilityFilesEntity,
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
    }): Promise<InfinityPaginationResultType<Facility>> {
        const where: FindOptionsWhere<FacilitiesEntity> = {};
        if (filterOptions?.name?.length) {
            where.name = ILike(`%${filterOptions.name}%`);
        }

        if (filterOptions?.status) {
            where.status = filterOptions.status;
        }

        const totalRecords = await this.facilityRepository.count({ where });

        paginationOptions.totalRecords = totalRecords;
        const entities = await this.facilityRepository.find({
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
        const records = entities.map((product) => FacilityMapper.toDomain(product));

        return {
            data: records,
            currentPage: paginationOptions.page,
            totalRecords: totalRecords,
            hasNextPage: records.length === paginationOptions.limit,
        };
    }
    async findOne(fields: EntityCondition<Facility>): Promise<NullableType<Facility>> {
        const entity = await this.facilityRepository.findOne({
            where: fields as FindOptionsWhere<FacilitiesEntity>,
            relations: {
                files: { file: true },
            },
        });

        return entity ? FacilityMapper.toDomain(entity) : null;
    }
    async update(productId: string, updateData: Facility): Promise<Facility> {
        const facility = await this.facilityRepository.findOne({
            where: { id: productId },
        });
        if (!facility) {
            throw new CustomException('Facility not found', HttpStatus.NOT_FOUND);
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
                        await this.createFacilityFile(
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

            const persistenceModel = FacilityMapper.toPersistence(updateData);
            const updatedEntity = await queryRunner.manager.save(
                FacilitiesEntity,
                persistenceModel,
            );

            await queryRunner.commitTransaction();

            return FacilityMapper.toDomain(updatedEntity);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async checkIsFileAlreadyAssignned(
        facilityId: string,
        fileId: string,
    ): Promise<boolean> {
        const entity = await this.facilityFileRepository.findOne({
            where: {
                file: { id: fileId },
                facility: { id: facilityId },
            },
        });

        if (!entity) {
            return false;
        }
        return true;
    }

    async softDelete(id: Facility["id"]): Promise<void> {
        await this.facilityRepository.softDelete(id!);
    }
}