import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, Query, UseGuards } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { City } from './domain/city.domain';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get('get-all-cities')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limits', { transform: (value) => (value ? Number(value) : 10) })
    limits?: number,
    @Query('name') name?: string,
  ): Promise<InfinityPaginationResultType<City>> {
    const page = pages ?? 1;
    let limit = limits ?? 10;

    if (limit > 50) {
      limit = 50;
    }

    const paginationResult = await this.citiesService.findManyWithPagination({
      filterOptions: { name },
      sortOptions: [],
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
  findOne(@Param('id') id: City['id']): Promise<NullableType<City>> {
    return this.citiesService.findOne({ id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateCityDto,
  ): Promise<City> {
    return this.citiesService.update(id, updateBatchDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<void> {
    return this.citiesService.delete(id);
  }
}
