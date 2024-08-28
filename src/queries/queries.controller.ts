import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateQueryDto } from './dto/create-query.dto';
import { QueryDomain } from './domain/query';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateQueryDto } from './dto/update-query.dto';

@Controller('queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) { }

  @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCityDto: CreateQueryDto, @Request() request): Promise<QueryDomain> {
    return this.queriesService.create(createCityDto, request);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limits', { transform: (value) => (value ? Number(value) : 10) })
    limits?: number,
    @Query('customerName') customerName?: string,
  ): Promise<InfinityPaginationResultType<QueryDomain>> {
    const page = pages ?? 1;
    let limit = limits ?? 10;

    if (limit > 50) {
      limit = 50;
    }

    const paginationResult = await this.queriesService.findManyWithPagination({
      filterOptions: { customerName },
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
  findOne(@Param('id') id: QueryDomain['id']): Promise<NullableType<QueryDomain>> {
    return this.queriesService.findOne({ id });
  }

  @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateQueryDto,
  ): Promise<QueryDomain> {
    return this.queriesService.update(id, updateBatchDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<void> {
    return this.queriesService.delete(id);
  }
}
