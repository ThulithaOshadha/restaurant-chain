import { Order } from "../../../order/domain/order";
import { OrdersEntity } from "../entity/order.entity";
import { UserEntity } from "../../../users/infrastructure/entities/user.entity";

export class OrderMapper {
    static toDomain(orderEntity: OrdersEntity): Order {
        const order = new Order();

        if (orderEntity.id) {
            order.id = orderEntity.id;
        }
        order.shippingAddress = orderEntity.shippingAddress;
        order.total = orderEntity.total;
        order.createdAt = orderEntity.createdAt;
        order.updatedAt = orderEntity.updatedAt;
        if (orderEntity.products) {
            order.products = orderEntity.products;
        }
        order.payment = orderEntity.payment;
        order.orderDate = orderEntity.orderDate;
        return order;

    }

    static toPersistence(order: Order): OrdersEntity {
        const orderEntity = new OrdersEntity();

        if (order.id) {
            orderEntity.id = order.id;
        }
        orderEntity.total = order.total;
        orderEntity.shippingAddress = order.shippingAddress!;
        orderEntity.orderStatus = order.orderStatus;
        orderEntity.orderDate = order.orderDate!;

        let user;
        if (order.user) {
            user = new UserEntity();
            user.id = order.user.id;
        }
        orderEntity.user = user;
        return orderEntity;

    }
}