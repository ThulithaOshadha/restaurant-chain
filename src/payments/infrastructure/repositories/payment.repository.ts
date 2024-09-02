import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from '../entity/payment.entity';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { AbstractPaymentRepository } from './abstract-payment.repository';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';
import { PaymentMapper } from '../mapper/payment.mapper';
import { CustomException } from '../../../exception/common-exception';
import { Payment } from '../../../payments/domain/payment.domain';
import { OrdersEntity } from '../../../order/infrastructure/entity/order.entity';
import { FilterPaymentDto, SortPaymentDto } from '../../../payments/dto/query-payment.dto';
import { PaymentStatusEnum } from '../../../order/enums/payment-status.enum';


@Injectable()
export class PaymentRepository implements AbstractPaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private dataSource: DataSource,
  ) { }

  async create(data: Payment): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const persistenceModel = PaymentMapper.toPersistence(data);
      const newEntity = await this.paymentRepository.save(
        this.paymentRepository.create(persistenceModel),
      );


      await queryRunner.manager.save(OrdersEntity, persistenceModel.order);
      return PaymentMapper.toDomain(newEntity);
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new CustomException('something went wrong', HttpStatus.UNPROCESSABLE_ENTITY);
    } finally {
      await queryRunner.release();
    }
  }
  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPaymentDto | null | undefined;
    sortOptions?: SortPaymentDto[] | null | undefined;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Payment>> {
    const where: FindOptionsWhere<PaymentEntity> = {};

    if (filterOptions?.contactNo) {
      where.order = {
        user: { contactNo: ILike(`%${filterOptions.contactNo}%`) },
      };
    }

    const totalRecords = await this.paymentRepository.count({ where });
    paginationOptions.totalRecords = totalRecords;
    const entities = await this.paymentRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: {
        updatedAt: 'DESC',
        ...sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy]: sort.order,
          }),
          {},
        ),
      },
    });
    const records = entities.map((payment) => PaymentMapper.toDomain(payment));
    return {
      data: records,
      currentPage: paginationOptions.page,
      totalRecords: totalRecords,
      hasNextPage: records.length === paginationOptions.limit,
    };
  }
  async findOne(
    fields: EntityCondition<Payment>,
  ): Promise<NullableType<Payment>> {
    const entity = await this.paymentRepository.findOne({
      where: fields as FindOptionsWhere<PaymentEntity>,
    });

    return entity ? PaymentMapper.toDomain(entity) : null;
  }
  async updatePayment(id: string, updateData: Payment): Promise<Payment> {

    return updateData;
  }

  updateOrderpaymentStatus(orderId: string, status: PaymentStatusEnum) { }

  async delete(id: string): Promise<void> {
    await this.paymentRepository.softDelete(id);
  }
}
