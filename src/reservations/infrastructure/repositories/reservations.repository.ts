import { InjectRepository } from "@nestjs/typeorm";
import { ReservationsEntity } from "../entities/reservations.entity";
import { AbstractReservationRepository } from "./abstract-reservations.repository";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { Order } from "../../../order/domain/order";
import { EntityCondition } from "../../../utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "../../../utils/types/infinity-pagination-result.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Reservation } from "../../../reservations/domain/reservation.domain";
import { FilterReservationDto, SortReservationDto } from "src/reservations/dto/query-reservation.dto";
import { ReservationTablesEntity } from "../entities/reservation-tables.entity";
import { ReservationMapper } from "../mappers/reservation.mapper";
import { CustomException } from "../../../exception/common-exception";
import { HttpStatus } from "@nestjs/common";
import { RestuarantTablesEntity } from "../entities/tables.entity";

export class ReservationRepository implements AbstractReservationRepository {
    constructor(
        @InjectRepository(ReservationsEntity)
        private readonly repository: Repository<ReservationsEntity>,
        @InjectRepository(ReservationTablesEntity)
        private readonly reservationTablesRepository: Repository<ReservationTablesEntity>,
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

    async reserveTable(
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

    findManyWithPagination({ filterOptions, sortOptions, paginationOptions, }: { filterOptions?: FilterReservationDto | null; sortOptions?: SortReservationDto[] | null; paginationOptions: IPaginationOptions; }): Promise<InfinityPaginationResultType<Order>> {
        throw new Error("Method not implemented.");
    }
    findOne(fields: EntityCondition<Reservation>): Promise<NullableType<Reservation>> {
        throw new Error("Method not implemented.");
    }
    updateReservation(id: string, reservation: Reservation): Promise<Reservation> {
        throw new Error("Method not implemented.");
    }


}