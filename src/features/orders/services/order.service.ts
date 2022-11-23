import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftService } from 'src/features/gifts/services/gift.service';
import { HistoryService } from 'src/features/histories/services/history.service';
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
        private readonly userService: UserService,
        private readonly productService: ProductService,
        private readonly giftService: GiftService,
        private readonly shopService: ShopService,
    ) {}

    async newOrder({ user, address, gifts, shop }: NewOrderDto): Promise<OrderEntity> {
        const userEntity = await this.userService.getUserById(user);
        const giftEntity = await this.giftService.findGiftById(gifts);

        if (!userEntity) {
            throw new Error('User not found');
        }

        const order = this.orderRepository.create({
            user: userEntity,
            address,
            gifts: giftEntity || null,
            shops: null,
            total: 0,
            status: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: false,
        });

        userEntity.orders.push(order);

        await this.userRepository.save(userEntity);
        return this.orderRepository.save(order);
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

    async addProductToOrder({ orderId, productId, count, shopId }: CreateProductToOrderDto): Promise<void> {
        const order = await this.getOrderById(orderId);
        const product = await this.productService.findProductById(productId);
        const shop = await this.shopService.getShopById(shopId);

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

        order.products.push(orderToProduct);
        order.total += orderToProduct.total;

        const shopProduct = await this.shopProductRepository.findOne({
            where: { shop, product },
        });

        if (shopProduct) {
            shopProduct.quantity -= count;
            await this.shopProductRepository.save(shopProduct);
        }

        await this.orderRepository.save(order);

        await this.orderToProductRepository.save(orderToProduct);
        await this.shopProductRepository.save(shopProduct);
        await this.orderRepository.save(order);
    }

    async createOrder({ user, address, gifts, products, shop }: CreateOrderDto): Promise<any> {
        const order = await this.newOrder({ user, address, gifts, shop });

        const orderResponse = await this.getOrderById(order.id);

        for (let i = 0; i < products.length; i++) {
            const productEntity = await this.productService.findProductById(products[i].id);
            const orderProduct = new OrderToProductEntity();
            orderProduct.order = orderResponse;
            orderProduct.product = productEntity;
            orderProduct.count = products[i].quantity;
            orderProduct.price = productEntity.price;
            orderProduct.total = productEntity.price * products[i].quantity;
            orderProduct.createdAt = new Date();
            orderProduct.updatedAt = new Date();
            orderProduct.deletedAt = false;

            orderResponse.products.push(orderProduct);
            orderResponse.total += orderProduct.total;

            await this.orderToProductRepository.save(orderProduct);
            await this.orderRepository.save(orderResponse);

            // update quantity of product in shop
        }

        // const history = this.historyService.createHistory({
        //     imageId: null,
        //     orderId: orderResponse.id,
        //     userId: orderResponse.user.id,
        // });

        return {};
    }
}
