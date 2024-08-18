import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, ILike, QueryRunner, Repository } from "typeorm";
import { Product } from "src/products/domain/product";
import { FilterProductDto } from "src/products/dto/filter-product.dto";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { NullableType } from "src/utils/types/nullable.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { CustomException } from "src/exception/common-exception";
import { FileEntity } from "src/files/infrastructure/persistence/relational/entities/file.entity";
import { AbstractBranchRepository } from "./abstract-branches.repository";
import { BranchesEntity } from "../entities/braches.entity";
import { BranchFilesEntity } from "../entities/branch-files.entity";
import { Branch } from "src/branches/domain/branch.domain";
import { BranchMapper } from "../mappers/branch.mapper";

@Injectable()
export class BranchRepository implements AbstractBranchRepository {
    constructor(
        @InjectRepository(BranchesEntity) 
        private readonly branchRepository: Repository<BranchesEntity>,
        @InjectRepository(BranchFilesEntity)
        private readonly branchFileRepository: Repository<BranchFilesEntity>,
        private dataSource: DataSource,
    ) { }

    async create(data: Branch): Promise<Branch> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();

            const persistenceModel = BranchMapper.toPersistence(data);

            const newEntity = await queryRunner.manager.save(
                BranchesEntity,
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
            return BranchMapper.toDomain(newEntity);
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
    ): Promise<BranchFilesEntity> {
        const branchFile = this.branchFileRepository.create({
            file: { id: fileId } as FileEntity,
            branch: { id: productId } as BranchesEntity,
            altTag: altTag,
            isDefault: isDefault,
        });

        const branchFileEntity = await queryRunner.manager.save(
            BranchFilesEntity,
            branchFile,
        );
        return branchFileEntity;
    }

    async findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterProductDto | null | undefined;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Branch>> {
        const where: FindOptionsWhere<BranchesEntity> = {};
        if (filterOptions?.name?.length) {
            where.name = ILike(`%${filterOptions.name}%`);
        }

        if (filterOptions?.status) {
            where.status = filterOptions.status;
        }

        const totalRecords = await this.branchRepository.count({ where });

        paginationOptions.totalRecords = totalRecords;
        const entities = await this.branchRepository.find({
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
        const records = entities.map((product) => BranchMapper.toDomain(product));

        return {
            data: records,
            currentPage: paginationOptions.page,
            totalRecords: totalRecords,
            hasNextPage: records.length === paginationOptions.limit,
        };
    }
    async findOne(fields: EntityCondition<Branch>): Promise<NullableType<Branch>> {
        const entity = await this.branchRepository.findOne({
            where: fields as FindOptionsWhere<BranchesEntity>,
            relations: {
                files: { file: true },
            },
        });

        return entity ? BranchMapper.toDomain(entity) : null;
    }
    async update(id: string, updateData: Branch): Promise<Branch> {
        const product = await this.branchRepository.findOne({
            where: { id: id },
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
                        id,
                        file?.id!,
                    );

                    if (isAlreadyAssigned) {
                        continue;
                    }
                    if (!isAlreadyAssigned) {
                        await this.createProductFile(
                            id,
                            file.id!,
                            file.altTag!,
                            file.isDefault!,
                            queryRunner,
                        );
                    }
                }

                //await this.deleteUselessProductFiles(productId, updateData.files);
            }

            const persistenceModel = BranchMapper.toPersistence(updateData);
            const updatedEntity = await queryRunner.manager.save(
                BranchesEntity,
                persistenceModel,
            );

            await queryRunner.commitTransaction();

            return BranchMapper.toDomain(updatedEntity);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async checkIsFileAlreadyAssignned(
        branchId: string,
        fileId: string,
    ): Promise<boolean> {
        const entity = await this.branchFileRepository.findOne({
            where: {
                file: { id: fileId },
                branch: { id: branchId },
            },
        });

        if (!entity) {
            return false;
        }
        return true;
    }

    async softDelete(id: Branch["id"]): Promise<void> {
        await this.branchRepository.softDelete(id!);
    }
}