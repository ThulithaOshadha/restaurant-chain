import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { Reservation } from './domain/reservation.domain';


describe('ReservationsController', () => {
  let controller: ReservationsController;
  let reservationsService: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [ReservationsService],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    reservationsService = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation', async () => {
      const createdDto = new CreateReservationDto(
        new Date(),  // reservationDate
        7,           // personCount
        '89',        // branchId
        'table-id'   // tableId
      );

      const createdReservation: Reservation = {
        id: 'some-id',
        branch: {
          id: createdDto.getBranchId,
          name: 'test'
        },
        table: {
          id: createdDto.getTableId,
          name: 'A1',
          personCount: 4
        },
        // Add other fields as per your Reservation entity
      };

      jest.spyOn(reservationsService, 'create').mockResolvedValue(createdReservation);

      const result = await controller.create(createdDto);

      expect(result).toEqual(createdReservation);
    });
  });

  describe('findAll', () => {
    it('should find all reservations with default pagination options', async () => {
      const mockPaginationResult: InfinityPaginationResultType<Reservation> = {
        data: [], // Mock data as per your expected response
        currentPage: 1,
        hasNextPage: true,
        totalRecords: 0,
      };

      jest.spyOn(reservationsService, 'findManyWithPagination').mockResolvedValue(mockPaginationResult);

      const result = await controller.findAll();

      expect(result).toEqual(expect.objectContaining(mockPaginationResult));
    });

    // Add more tests to cover different scenarios of findAll method
  });

  describe('findOne', () => {
    it('should find one reservation by id', async () => {
      const reservationId = 'some-id';
      const mockReservation: Reservation = {
        id: reservationId,
        branch: {
          id: 'branch-id',
          name: 'test name'
        }
      };

      jest.spyOn(reservationsService, 'findOne').mockResolvedValue(mockReservation);

      const result = await controller.findOne(reservationId);

      expect(result).toEqual(mockReservation);
    });

    // Add more tests to cover different scenarios of findOne method
  });
});
