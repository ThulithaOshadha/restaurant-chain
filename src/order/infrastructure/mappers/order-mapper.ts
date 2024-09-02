import { Order } from "src/order/domain/order";
import { OrdersEntity } from "../entity/order.entity";
import { ProductMapper } from "src/products/infrastructure/mappers/product-mapper";

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
        return order;

    }
}