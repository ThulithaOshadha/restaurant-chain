import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Branch } from './domain/branch.domain';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateBranchDto): Promise<Branch> {
    console.log('createDto ===== ',createDto);
    
    return this.branchesService.create(createDto);
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
  ): Promise<InfinityPaginationResultType<Branch>> {
    const page = pages ?? 1;
    let limit = limits ?? 10000;

    const paginationResult = await this.branchesService.findManyWithPagination({
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
  findOne(@Param('id') id: Branch['id']): Promise<NullableType<Branch>> {
    return this.branchesService.findOne({ id });
  }

  @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Put(':id') // Using HTTP PUT for update
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateBranchDto,
  ): Promise<Branch> {    
    return this.branchesService.update(id, updateProductDto);
  }
}
