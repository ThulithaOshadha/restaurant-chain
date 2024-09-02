import { Test, TestingModule } from '@nestjs/testing';
import { BranchesService } from './branches.service';
import { AbstractBranchRepository } from './infrastructure/repositories/abstract-branches.repository';
import { FacilitiesService } from '../facilities/facilities.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Branch } from './domain/branch.domain';
import { Facility } from '../facilities/domain/facility';
import { CustomException } from '../exception/common-exception';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { HttpStatus } from '@nestjs/common';
import { StatusEnum } from '../statuses/statuses.enum';

describe('BranchesService', () => {
  let service: BranchesService;
  let branchRepository: AbstractBranchRepository;
  let facilitiesService: FacilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchesService,
        {
          provide: AbstractBranchRepository,
          useValue: {
            create: jest.fn(),
            findManyWithPagination: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: FacilitiesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BranchesService>(BranchesService);
    branchRepository = module.get<AbstractBranchRepository>(AbstractBranchRepository);
    facilitiesService = module.get<FacilitiesService>(FacilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a branch successfully', async () => {
      const createDto: CreateBranchDto = {
        getName: 'New Branch',
        getDescription: 'Description',
        getFiles: [],
        getFacilities: ['1', '2'],
      } as any;

      const facility: Facility = { id: '1', name: 'Facility 1' } as Facility;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(facilitiesService, 'findOne').mockResolvedValueOnce(facility);
      jest.spyOn(branchRepository, 'create').mockResolvedValueOnce(createDto as any);

      const result = await service.create(createDto);
      expect(result).toEqual(createDto);
      expect(branchRepository.create).toHaveBeenCalledWith({
        name: createDto.getName,
        description: createDto.getDescription,
        fiels: createDto.getFiles,
        facilities: [facility],
      });
    });

    it('should throw an error if branch name already exists', async () => {
      const createDto: CreateBranchDto = {
        getName: 'Existing Branch',
        getDescription: 'Description',
        getFiles: [],
        getFacilities: [],
      } as any;

      //jest.spyOn(service, 'findOne').mockResolvedValueOnce({ name: 'Existing Branch', deletedAt: null } as Branch);

      await expect(service.create(createDto)).rejects.toThrowError(CustomException);
    });

    it('should throw an error if facility does not exist', async () => {
      const createDto: CreateBranchDto = {
        getName: 'New Branch',
        getDescription: 'Description',
        getFiles: [],
        getFacilities: ['1', '2'],
      } as any;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(facilitiesService, 'findOne').mockResolvedValueOnce(null);

      await expect(service.create(createDto)).rejects.toThrowError(new CustomException('Facility does not exist', HttpStatus.NOT_FOUND));
    });
  });

  describe('findManyWithPagination', () => {
    it('should return paginated branches', async () => {
      const paginationResult = {
        totalRecords: 2,
        data: [{ name: 'Branch 1' }, { name: 'Branch 2' }],
      };

      jest.spyOn(branchRepository, 'findManyWithPagination').mockResolvedValueOnce(paginationResult as any);

      const result = await service.findManyWithPagination({ filterOptions: null, paginationOptions: { page: 1, limit: 10 } });
      expect(result).toEqual(paginationResult);
      expect(branchRepository.findManyWithPagination).toHaveBeenCalledWith({ filterOptions: null, paginationOptions: { page: 1, limit: 10 } });
    });
  });

  describe('findOne', () => {
    it('should find and return a branch', async () => {
      const branch: Branch = { id: '1', name: 'Branch 1' } as Branch;

      jest.spyOn(branchRepository, 'findOne').mockResolvedValueOnce(branch);

      const result = await service.findOne({ id: '1' });
      expect(result).toEqual(branch);
      expect(branchRepository.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    it('should return null if branch does not exist', async () => {
      jest.spyOn(branchRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findOne({ id: '1' });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing branch', async () => {
      const branchId = 'branch-id';
      const existingBranch: Branch = {
        id: branchId,
        name: 'existing branch',
        description: 'Old description',
        facilities: [],
        deletedAt: undefined,
      };

      const updateDto: UpdateBranchDto = new UpdateBranchDto(
        'updated branch',
        40.7128,
        -74.0060,
        StatusEnum.active,
        [{ id: 'id', path: 'file-url' }],
        'Updated description',
        ['facility-id-1', 'facility-id-2'],
      );

      const updatedBranch: Branch = {
        ...existingBranch,
        name: updateDto.getName,
        description: updateDto.getDescription,
        facilities: [], // Mock data
      };

      jest.spyOn(branchRepository, 'findOne').mockResolvedValue(existingBranch);
      jest.spyOn(branchRepository, 'update').mockResolvedValue(updatedBranch);
      jest.spyOn(facilitiesService, 'findOne').mockImplementation(async (condition) => {
        if (condition.id === 'facility-id-1' || condition.id === 'facility-id-2') {
          return { id: condition.id, name: 'Facility Name' } as Facility;
        }
        return null;
      });

      const result = await service.update(branchId, updateDto);

      expect(result).toEqual(updatedBranch);
      expect(branchRepository.update).toHaveBeenCalledWith(branchId, {
        id: branchId,
        ...updateDto,
        facilities: [], // Mock data
      });
    });

    it('should throw an exception if branch does not exist', async () => {
      const branchId = 'branch-id';
      const updateDto: UpdateBranchDto = new UpdateBranchDto();

      jest.spyOn(branchRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(branchId, updateDto)).rejects.toThrowError(
        new CustomException('Branch not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if facility does not exist', async () => {
      const branchId = 'branch-id';
      const updateDto: UpdateBranchDto = new UpdateBranchDto(
        'updated branch',
        undefined,
        undefined,
        undefined,
        [],
        undefined,
        ['invalid-facility-id'],
      );

      jest.spyOn(branchRepository, 'findOne').mockResolvedValue({
        id: branchId,
        name: 'existing branch',
        description: 'Old description',
        facilities: [],
        deletedAt: undefined,
      });
      jest.spyOn(facilitiesService, 'findOne').mockResolvedValue(null);

      await expect(service.update(branchId, updateDto)).rejects.toThrowError(
        new CustomException('Facility does not exist', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if branch name already exists', async () => {
      const branchId = 'branch-id';
      const updateDto: UpdateBranchDto = new UpdateBranchDto('existing branch name');

      jest.spyOn(branchRepository, 'findOne').mockResolvedValueOnce({
        id: branchId,
        name: 'different branch name',
        description: 'Old description',
        facilities: [],
        deletedAt: undefined,
      });
      jest.spyOn(branchRepository, 'findOne').mockResolvedValueOnce({
        id: 'existing-id',
        name: 'existing branch name',
        description: 'Old description',
        facilities: [],
        deletedAt: undefined,
      });

      await expect(service.update(branchId, updateDto)).rejects.toThrowError(
        new CustomException('product name already exists', HttpStatus.CONFLICT),
      );
    });
  });


  describe('softDelete', () => {
    it('should soft delete a branch successfully', async () => {
      jest.spyOn(branchRepository, 'softDelete').mockResolvedValueOnce(undefined);

      await service.softDelete('1');
      expect(branchRepository.softDelete).toHaveBeenCalledWith('1');
    });
  });
});
