import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { Reservation } from './domain/reservation.domain';
import { ApiParam } from '@nestjs/swagger';
import { NullableType } from 'src/utils/types/nullable.type';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createdDto: CreateReservationDto) {
    return this.reservationsService.create(createdDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 100) })
    limits?: number,
    @Query('userId') userId?: string,

  ): Promise<InfinityPaginationResultType<Reservation>> {
    const page = pages ?? 1;
    let limit = limits ?? 100;

    const paginationResult = await this.reservationsService.findManyWithPagination({
      filterOptions: {
        userId,
      },
      paginationOptions: {
        page,
        limit,
      },
    });

    const { totalRecords } = paginationResult;

    return {
      ...paginationResult,
      totalRecords,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Reservation['id']): Promise<NullableType<Reservation>> {
    return this.reservationsService.findOne({ id });
  }
}
