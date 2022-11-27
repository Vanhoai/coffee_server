import { ConsoleLogger, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftService } from 'src/features/gifts/services/gift.service';
import { HistoryService } from 'src/features/histories/services/history.service';
import { ProductEntity } from 'src/features/products/entities/product.entity';
import { ProductService } from 'src/features/products/services/product.service';
import { ShopProductEntity } from 'src/features/shops/entities/shop-product.entity';
import { ShopService } from 'src/features/shops/services/shop.service';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { UserService } from 'src/features/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { CreateProductToOrderDto } from '../dtos/CreateProductToOrder.dto';
import { NewOrderDto } from '../dtos/NewOrder.dto';
import { OrderToProductEntity } from '../entities/order-product.entity';
import { OrderEntity } from '../entities/order.entity';
import { getConfig } from 'src/config';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderToProductEntity)
        private readonly orderToProductRepository: Repository<OrderToProductEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @Inject(forwardRef(() => HistoryService))
        private readonly historyService: HistoryService,
        @InjectRepository(ShopProductEntity)
        private readonly shopProductRepository: Repository<ShopProductEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly userService: UserService,
        private readonly productService: ProductService,
        private readonly giftService: GiftService,
        private readonly shopService: ShopService,
    ) {}

    async newOrder({ user, address }: NewOrderDto): Promise<OrderEntity> {
        const userEntity = await this.userService.getUserById(user);

        if (!userEntity) {
            throw new Error('User not found');
        }

        const order = new OrderEntity();
        order.user = userEntity;
        order.address = address;
        order.total = 0;
        order.status = 0;
        order.createdAt = new Date();
        order.updatedAt = new Date();
        order.deletedAt = false;

        const response = await this.orderRepository.save(order);

        userEntity.orders = [...userEntity.orders, order];
        await this.userRepository.save(userEntity);

        return response;
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

    async addProductToOrder({ orderId, productId, count, shopId }: CreateProductToOrderDto): Promise<any> {
        const order = await this.getOrderById(orderId);
        const product = await this.productService.findProductById(productId);

        if (!order || !product) {
            throw new Error('Order or Product not found');
        }

        const orderToProduct = new OrderToProductEntity();
        orderToProduct.order = order;
        orderToProduct.product = product;
        orderToProduct.count = count;
        orderToProduct.price = product.price;
        orderToProduct.total = product.price * count;
        orderToProduct.createdAt = new Date();
        orderToProduct.updatedAt = new Date();
        orderToProduct.deletedAt = false;
        await this.orderToProductRepository.save(orderToProduct);

        order.products.push(orderToProduct);
        order.total += orderToProduct.total;
        await this.orderRepository.save(order);

        product.orders.push(orderToProduct);
        await this.productRepository.save(product);

        const shopProductEntity = await this.shopProductRepository
            .createQueryBuilder('shop_product')
            .leftJoinAndSelect('shop_product.product', 'product')
            .leftJoinAndSelect('shop_product.shop', 'shop')
            .where('shop_product.product = :productId', { productId })
            .andWhere('shop_product.shop = :shopId', { shopId })
            .getOne();

        if (!shopProductEntity) {
            return {
                message: 'Shop product not found',
                error: true,
            };
        }

        shopProductEntity.quantity -= count;
        await this.shopProductRepository.save(shopProductEntity);
    }

    async createOrder({ user, address, products, shop }: CreateOrderDto): Promise<any> {
        const order = await this.newOrder({ user, address });
        const orderResponse = await this.getOrderById(order.id);

        for (const product of products) {
            await this.addProductToOrder({
                orderId: orderResponse.id,
                productId: product.id,
                count: product.quantity,
                shopId: shop,
            });
        }

        return await this.getOrderById(orderResponse.id);
    }

    async updateStatusOrder({ id, status }): Promise<any> {
        const order = await this.getOrderById(id);
        if (!order) {
            return {
                message: 'Order not found',
                error: true,
            };
        }

        // if order delivered
        if (status === getConfig().ORDER_STATUS.DELIVERED) {
            // create history
            await this.historyService.createHistory({
                userId: order.user.id,
                orderId: order.id,
            });

            // delete order from user
            const userEntity = await this.userRepository.findOne({
                where: { id: order.user.id },
                relations: ['orders'],
            });

            userEntity.orders = userEntity.orders.filter((order) => order.id !== id);
            await this.userRepository.save(userEntity);

            return await this.orderRepository.save(order);
        }

        order.status = status;
        order.updatedAt = new Date();
        return await this.orderRepository.save(order);
    }
}
