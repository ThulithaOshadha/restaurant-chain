import { Gallery } from "src/gallery/domain/gallery";
import { FilterGallerDto } from "src/gallery/dto/filter-gallery.dto";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { NullableType } from "src/utils/types/nullable.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { AbstractGalleryRepository } from "./abstract-gallery.repository";
import { DataSource, FindOptionsWhere, QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GalleryEntity } from "../entities/gallery.entity";
import { GalleryFilesEntity } from "../entities/gallery-files.entity";
import { GalleryMapper } from "../mappers/gallery.mapper";
import { CustomException } from "src/exception/common-exception";
import { HttpStatus } from "@nestjs/common";
import { FileEntity } from "src/files/infrastructure/persistence/relational/entities/file.entity";

export class GalleryRepository implements AbstractGalleryRepository {
    constructor(
        @InjectRepository(GalleryEntity)
        private readonly galleryRepository: Repository<GalleryEntity>,
        @InjectRepository(GalleryFilesEntity)
        private readonly galleryFileRepository: Repository<GalleryFilesEntity>,
        private dataSource: DataSource,) { }


    async create(data: Gallery): Promise<Gallery> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();

        try {
            await queryRunner.startTransaction();

            const persistenceModel = GalleryMapper.toPersistence(data);

            const newEntity = await queryRunner.manager.save(
                GalleryEntity,
                persistenceModel,
            );

            const fileArray: any = [];
            if (data.files?.length) {
                for (let file of data.files) {
                    const fileEntity = await this.createGalleryFile(
                        newEntity.id,
                        file.id!,
                        file.isDefault!,
                        queryRunner,
                    );
                    fileArray.push(fileEntity);
                }
            }

            await queryRunner.commitTransaction();
            newEntity.file = fileArray;
            return GalleryMapper.toDomain(newEntity);
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new CustomException(`${error.message}`, HttpStatus.UNPROCESSABLE_ENTITY);
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }
    async createGalleryFile(galleryIdd: string, fileId: string, isDefault: boolean, queryRunner: QueryRunner) {
        const productFile = this.galleryFileRepository.create({
            file: { id: fileId } as FileEntity,
            gallery: { id: galleryIdd } as GalleryEntity,
            isDefault: isDefault,
        });

        const productFileEntity = await queryRunner.manager.save(
            GalleryFilesEntity,
            productFile,
        );
        return productFileEntity;
    }
    async findManyWithPagination({
        filterOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterGallerDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Gallery>> {
        const where: FindOptionsWhere<GalleryEntity> = {};

        const totalRecords = await this.galleryRepository.count({ where });

        paginationOptions.totalRecords = totalRecords;
        const entities = await this.galleryRepository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            relations: {
                file: { file: true },
            },
        });

        const records = entities.map((product) => GalleryMapper.toDomain(product));

        return {
            data: records,
            currentPage: paginationOptions.page,
            totalRecords: totalRecords,
            hasNextPage: records.length === paginationOptions.limit,
        };
    }
    async findOne(fields: EntityCondition<Gallery>): Promise<NullableType<Gallery>> {
        const entity = await this.galleryRepository.findOne({
            where: fields as FindOptionsWhere<GalleryEntity>,
            relations: {
                file: { file: true },
            },
        });

        return entity ? GalleryMapper.toDomain(entity) : null;
    }

}