import { InjectRepository } from "@nestjs/typeorm";
import { ReservationsEntity } from "../entities/reservations.entity";
import { AbstractReservationRepository } from "./abstract-reservations.repository";
import { DataSource, FindOptionsWhere, QueryRunner, Repository } from "typeorm";
import { EntityCondition } from "../../../utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "../../../utils/types/infinity-pagination-result.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Reservation } from "../../../reservations/domain/reservation.domain";
import { FilterReservationDto, SortReservationDto } from "../../../reservations/dto/query-reservation.dto";
import { ReservationTablesEntity } from "../entities/reservation-tables.entity";
import { ReservationMapper } from "../mappers/reservation.mapper";
import { CustomException } from "../../../exception/common-exception";
import { HttpStatus } from "@nestjs/common";
import { RestuarantTablesEntity } from "../entities/tables.entity";
import { Tables } from "../../../reservations/domain/tables";
import { TableMapper } from "../mappers/tabel";

export class ReservationRepository implements AbstractReservationRepository {
    constructor(
        @InjectRepository(ReservationsEntity)
        private readonly repository: Repository<ReservationsEntity>,
        @InjectRepository(ReservationTablesEntity)
        private readonly reservationTablesRepository: Repository<ReservationTablesEntity>,
        @InjectRepository(RestuarantTablesEntity)
        private readonly tablesRepository: Repository<RestuarantTablesEntity>,
        private dataSource: DataSource,

    ) { }
   
    async create(data: Reservation): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.startTransaction();

            const persistenceOrderModel = ReservationMapper.toPersistence(data);

            const newOrder = await queryRunner.manager.save(
                ReservationsEntity,
                persistenceOrderModel,
            );

            return ReservationMapper.toDomain(newOrder);

        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new CustomException(
                `${error.message}`,
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }

    private async reserveTable(
        queryRunner: QueryRunner,
        reservationId: string,
        tableId: string,
    ): Promise<ReservationTablesEntity> {
        const orderProducts = this.reservationTablesRepository.create({
            reservation: { id: reservationId } as ReservationsEntity,
            table: { id: tableId } as RestuarantTablesEntity,

        });
        return await queryRunner.manager.save(ReservationTablesEntity, orderProducts);
    }

    async findManyWithPagination({ filterOptions, sortOptions, paginationOptions, }: { filterOptions?: FilterReservationDto | null; sortOptions?: SortReservationDto[] | null; paginationOptions: IPaginationOptions; }): Promise<InfinityPaginationResultType<Reservation>> {
        const where: FindOptionsWhere<ReservationsEntity> = {};

        if (filterOptions?.userId) {
            where.user = {
                id: filterOptions.userId,
            };
        }
        const totalRecords = await this.repository.count({ where });
        paginationOptions.totalRecords = totalRecords;
        const entities = await this.repository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            order: {
                updatedAt: 'DESC',
                ...sortOptions?.reduce(
                    (accumulator, sort) => ({
                        ...accumulator,
                        [sort.orderBy]: sort.order,
                    }),
                    {},
                ),
            },
        });
        const records = entities.map((payment) => ReservationMapper.toDomain(payment));
        return {
            data: records,
            currentPage: paginationOptions.page,
            totalRecords: totalRecords,
            hasNextPage: records.length === paginationOptions.limit,
        };
    }
    async findOne(fields: EntityCondition<Reservation>): Promise<NullableType<Reservation>> {
        const entity = await this.repository.findOne({
            where: fields as FindOptionsWhere<ReservationsEntity>,
        });

        return entity ? ReservationMapper.toDomain(entity) : null;
    }

    async tableFindOne(fields: EntityCondition<Tables>): Promise<NullableType<Tables>> {
        const entity = await this.tablesRepository.findOne({
            where: fields as FindOptionsWhere<RestuarantTablesEntity>,
        });

        return entity ? TableMapper.toDomain(entity) : null;
    }
    
    updateReservation(id: string, reservation: Reservation): Promise<Reservation> {
        throw new Error("Method not implemented.");
    }


}