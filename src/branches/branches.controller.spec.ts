import { Test, TestingModule } from '@nestjs/testing';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './domain/branch.domain';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { NullableType } from 'src/utils/types/nullable.type';

describe('BranchesController', () => {
  let controller: BranchesController;
  let service: BranchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchesController],
      providers: [
        {
          provide: BranchesService,
          useValue: {
            create: jest.fn(),
            findManyWithPagination: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BranchesController>(BranchesController);
    service = module.get<BranchesService>(BranchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a branch', async () => {
      const createDto: CreateBranchDto = new CreateBranchDto(/* initialize with test data */);
      const result: Branch = {} as Branch;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  // describe('findAll', () => {
  //   it('should return a list of branches with pagination', async () => {
  //     const result: InfinityPaginationResultType<Branch> = {
  //       results: [],
  //       totalRecords: 0,
  //     };

  //     jest.spyOn(service, 'findManyWithPagination').mockResolvedValue(result);

  //     expect(await controller.findAll(1, 10000, 'branchName', StatusEnum.active)).toBe(result);
  //     expect(service.findManyWithPagination).toHaveBeenCalledWith({
  //       filterOptions: { name: 'branchName', status: StatusEnum.active },
  //       paginationOptions: { page: 1, limit: 10000 },
  //     });
  //   });
  // });

  describe('findOne', () => {
    it('should return a single branch', async () => {
      const result: NullableType<Branch> = {} as Branch;
      const id = 'some-id';

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith({ id });
    });
  });

  describe('update', () => {
    it('should update a branch', async () => {
      const updateDto: UpdateBranchDto = new UpdateBranchDto(/* initialize with test data */);
      const result: Branch = {} as Branch;
      const id = 'some-id';

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });
});
