import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './domain/product';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get('get-all-products') 
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 10000) })
    limits?: number,
    @Query('name') name?: string,
    @Query('status') status?: StatusEnum,
  ): Promise<InfinityPaginationResultType<Product>> {
    const page = pages ?? 1;
    let limit = limits ?? 10000;

    const paginationResult = await this.productsService.findManyWithPagination({
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
  findOne(@Param('id') id: Product['id']): Promise<NullableType<Product>> {
    return this.productsService.findOne({ id });
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
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProductData(id, updateProductDto);
  }
}
