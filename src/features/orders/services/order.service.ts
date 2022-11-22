import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftService } from 'src/features/gifts/services/gift.service';
import { HistoryEntity } from 'src/features/histories/entities/history.entity';
import { HistoryService } from 'src/features/histories/services/history.service';
import { ProductService } from 'src/features/products/services/product.service';
import { ShopService } from 'src/features/shops/services/shop.service';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { UserService } from 'src/features/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { CreateProductToOrderDto } from '../dtos/CreateProductToOrder.dto';
import { NewOrderDto } from '../dtos/NewOrder.dto';
import { OrderToProductEntity } from '../entities/order-product.entity';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderToProductEntity)
        private readonly orderToProductRepository: Repository<OrderToProductEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly userService: UserService,
        private readonly productService: ProductService,
        private readonly giftService: GiftService,
        private readonly shopService: ShopService,
        private readonly historyService: HistoryService,
    ) {}

    async newOrder({ userId, address, gifts, shop }: NewOrderDto): Promise<OrderEntity> {
        const userEntity = await this.userService.getUserById(userId);
        const giftEntity = await this.giftService.findGiftById(gifts);
        const shopEntity = await this.shopService.getShopById(shop);

        if (!userEntity) {
            throw new Error('User not found');
        }

        const order = new OrderEntity();
        order.user = userEntity;
        order.shops = shopEntity;
        order.status = 0;
        order.total = 0;
        order.address = address;
        order.products = [];
        order.createdAt = new Date();
        order.updatedAt = new Date();
        order.deletedAt = false;

        if (giftEntity) {
            order.gifts = giftEntity;
        }

        userEntity.orders.push(order);

        await this.userRepository.save(userEntity);

        return await this.orderRepository.save(order);
    }

    async getAllOrder(): Promise<OrderEntity[]> {
        return await this.orderRepository.find({
            relations: ['user', 'products'],
            where: { deletedAt: false },
        });
    }

    async getOrderById(id: number): Promise<OrderEntity> {
        return await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'products'],
        });
    }

    async updateOrder(id: number, status: number): Promise<OrderEntity> {
        const order = await this.getOrderById(id);
        if (!order) {
            throw new Error('Order not found');
        }

        order.status = status;
        order.updatedAt = new Date();

        return await this.orderRepository.save(order);
    }

    async deleteOrder(id: number): Promise<OrderEntity> {
        const order = await this.getOrderById(id);
        if (!order) {
            throw new Error('Order not found');
        }

        order.deletedAt = true;
        order.updatedAt = new Date();

        return await this.orderRepository.save(order);
    }

    async removeOrder(id: number): Promise<OrderEntity> {
        const order = await this.getOrderById(id);
        if (!order) {
            throw new Error('Order not found');
        }

        return await this.orderRepository.remove(order);
    }

    async addProductToOrder({ orderId, productId, count }: CreateProductToOrderDto): Promise<OrderEntity> {
        const order = await this.getOrderById(orderId);
        const product = await this.productService.findProductById(productId);

        if (!order || !product) {
            throw new Error('Order or product not found');
        }

        const orderToProduct = new OrderToProductEntity();
        orderToProduct.order = order;
        orderToProduct.product = product;
        orderToProduct.price = product.price;
        orderToProduct.count = count;
        orderToProduct.total = product.price * count;
        orderToProduct.createdAt = new Date();
        orderToProduct.updatedAt = new Date();
        orderToProduct.deletedAt = false;

        order.products.push(orderToProduct);
        order.total += orderToProduct.total;

        product.orders.push(orderToProduct);
        product.quantity -= count;

        await this.orderToProductRepository.save(orderToProduct);

        return await this.orderRepository.save(order);
    }

    async createOrder({ user, address, voucher, products, shop }: CreateOrderDto): Promise<OrderEntity> {
        const order = await this.newOrder({ userId: user, address, gifts: voucher, shop });
        setTimeout(async () => {
            for (const product of products) {
                await this.addProductToOrder({ orderId: order.id, productId: product.id, count: product.quantity });
            }
        }, 0);

        const orderResponse = await this.getOrderById(order.id);
        // save to history of user
        // await this.historyService.createHistory({
        //     imageId: orderResponse.shops.image.id,
        //     userId: orderResponse.user.id,
        //     orderId: orderResponse.id,
        // });

        return orderResponse;
    }
}
