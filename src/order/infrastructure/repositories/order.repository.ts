import { InjectRepository } from "@nestjs/typeorm";
import { AbstractOrderRepository } from "./abstarct-order.repository";
import { OrdersEntity } from "../entity/order.entity";
import { DataSource, FindOptionsWhere, QueryRunner, Repository } from "typeorm";
import { OrderProductsEntity } from "../entity/order-product.entity";
import { Order } from "../../../order/domain/order";
import { FilterOrderDto, SortOrderDto } from "../../../order/dto/query-order.dto";
import { EntityCondition } from "../../../utils/types/entity-condition.type";
import { InfinityPaginationResultType } from "../../../utils/types/infinity-pagination-result.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { OrderMapper } from "../mappers/order-mapper";
import { CustomException } from "../../../exception/common-exception";
import { HttpStatus } from "@nestjs/common";
import { ProductsEntity } from "../../../products/infrastructure/entities/products.entity";

export class OrderRepository implements AbstractOrderRepository {
    constructor(
        @InjectRepository(OrdersEntity)
        private readonly orderRepository: Repository<OrdersEntity>,
        @InjectRepository(OrderProductsEntity)
        private readonly orderProductsRepository: Repository<OrderProductsEntity>,
        private dataSource: DataSource,
    ) { }
    async create(data: Order): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.startTransaction();

            const persistenceOrderModel = OrderMapper.toPersistence(data);

            const newOrder = await queryRunner.manager.save(
                OrdersEntity,
                persistenceOrderModel,
            );

            if (data.products) {
                for (const product of data.products) {
                    await this.createOrderProduct(queryRunner, newOrder.id, product.qty, product.id, product.unitPrice)
                }

            }

            return OrderMapper.toDomain(newOrder);



        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw new CustomException(
                `${error.message}`,
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }

    async createOrderProduct(
        queryRunner: QueryRunner,
        orderId: string,
        qty: number,
        productId: string,
        unitPrice?: number,
    ): Promise<OrderProductsEntity> {
        const orderProducts = this.orderProductsRepository.create({
            order: { id: orderId } as OrdersEntity,
            products: { id: productId } as ProductsEntity,
            qty: qty,
            unitPrice: unitPrice,
        });
        return await queryRunner.manager.save(OrderProductsEntity, orderProducts);
    }

    async findManyWithPagination({ filterOptions, sortOptions, paginationOptions, }: { filterOptions?: FilterOrderDto | null; sortOptions?: SortOrderDto[] | null; paginationOptions: IPaginationOptions; }): Promise<InfinityPaginationResultType<Order>> {
        const where: FindOptionsWhere<OrdersEntity> = {};

        if (filterOptions?.userId) {
            where.user = {
                id: filterOptions.userId,
            };
        }
        const totalRecords = await this.orderRepository.count({ where });
        paginationOptions.totalRecords = totalRecords;
        const entities = await this.orderRepository.find({
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
        const records = entities.map((payment) => OrderMapper.toDomain(payment));
        return {
            data: records,
            currentPage: paginationOptions.page,
            totalRecords: totalRecords,
            hasNextPage: records.length === paginationOptions.limit,
        };
    }
    async findOne(fields: EntityCondition<Order>): Promise<NullableType<Order>> {
        const entity = await this.orderRepository.findOne({
            where: fields as FindOptionsWhere<OrdersEntity>,
        });

        return entity ? OrderMapper.toDomain(entity) : null;
    }

    updateOrderStatus(id: string, order: Order): Promise<Order> {
        throw new Error("Method not implemented.");
    }
    updateOrderPaymentMethod(order: Order): Promise<Order> {
        throw new Error("Method not implemented.");
    }
}