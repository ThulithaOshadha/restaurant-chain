import { HttpStatus, Injectable } from '@nestjs/common';
import { Reservation } from './domain/reservation.domain';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CustomException } from '../exception/common-exception';
import { BranchesService } from '../branches/branches.service';
import { AbstractReservationRepository } from './infrastructure/repositories/abstract-reservations.repository';
import { FilterReservationDto } from './dto/query-reservation.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
    constructor(
        private readonly repository: AbstractReservationRepository,
        private readonly branchService: BranchesService,

    ) { }

    async create(createDto: CreateReservationDto): Promise<Reservation> {
        const isBranchExist = await this.branchService.findOne({
            id: createDto.getBranchId,
        });

        if (!isBranchExist) {
            throw new CustomException(
                'Branch does not exist',
                HttpStatus.NOT_FOUND,
            );
        }

        const isTableExist = await this.repository.tableFindOne({
            id: createDto.getTableId,
        });

        if (!isTableExist) {
            throw new CustomException(
                'Table does not exist',
                HttpStatus.NOT_FOUND,
            );
        }
        const reservation = {
            reservationDate: createDto.getReservationDate,
            personCount: createDto.getPersonCount,
            branch: isBranchExist,
            table: isTableExist,
        };

        return await this.repository.create(reservation);
    }

    findManyWithPagination({
        filterOptions, paginationOptions,
    }: {
        filterOptions?: FilterReservationDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Reservation>> {
        return this.repository.findManyWithPagination({
            filterOptions,
            paginationOptions,
        });
    }

    findOne(fields: EntityCondition<Reservation>): Promise<NullableType<Reservation>> {
        return this.repository.findOne(fields);
    }

    async update(
        productId: string,
        updateData: UpdateReservationDto,
    ): Promise<Reservation> {
        const existingProduct = await this.repository.findOne({
            id: productId,
        });
        if (!existingProduct) {
            throw new CustomException('Facility not found', HttpStatus.NOT_FOUND);
        }

        const isBranchExist = await this.branchService.findOne({
            id: updateData.getBranchId,
        });

        if (!isBranchExist) {
            throw new CustomException(
                'Branch does not exist',
                HttpStatus.NOT_FOUND,
            );
        }

        const isTableExist = await this.repository.tableFindOne({
            id: updateData.getTableId,
        });

        if (!isTableExist) {
            throw new CustomException(
                'Table does not exist',
                HttpStatus.NOT_FOUND,
            );
        }
        const facilityDomain = {
            id: productId,
            reservationDate: updateData.getReservationDate,
            personCount: updateData.getPersonCount,
            branch: isBranchExist,
            table: isTableExist,
        }
        return this.repository.updateReservation(productId, facilityDomain);
    }


}
