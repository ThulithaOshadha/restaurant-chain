import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { OffersService } from './offers.service';
import { Offer } from './domain/offer';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateOfferDto): Promise<Offer> {
    return this.offersService.create(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 10000) })
    limits?: number,
    @Query('name') name?: string,
    @Query('status') status?: StatusEnum,
  ): Promise<InfinityPaginationResultType<Offer>> {
    const page = pages ?? 1;
    let limit = limits ?? 10000;

    const paginationResult = await this.offersService.findManyWithPagination({
      filterOptions: { name, status },
      paginationOptions: {
        page,
        limit,
      },
    });

    // Extract total records from pagination result
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
  findOne(@Param('id') id: Offer['id']): Promise<NullableType<Offer>> {
    return this.offersService.findOne({ id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put(':id') // Using HTTP PUT for update
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateOfferDto,
  ): Promise<Offer> {
    return this.offersService.update(id, updateProductDto);
  }
}
