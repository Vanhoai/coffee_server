import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConfig } from 'src/config';
import { GiftService } from 'src/features/gifts/services/gift.service';
import { HistoryService } from 'src/features/histories/services/history.service';
import { ProductEntity } from 'src/features/products/entities/product.entity';
import { ProductService } from 'src/features/products/services/product.service';
import { ShopProductEntity } from 'src/features/shops/entities/shop-product.entity';
import { ShopEntity } from 'src/features/shops/entities/shop.entity';
import { ShopService } from 'src/features/shops/services/shop.service';
import { BalanceEntity } from 'src/features/users/entities/balance.entity';
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
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(BalanceEntity)
        private readonly balanceRepository: Repository<BalanceEntity>,
        private readonly userService: UserService,
        private readonly productService: ProductService,
        private readonly giftService: GiftService,
        private readonly shopService: ShopService,
    ) {}

    async newOrder({ user, address, shop }: NewOrderDto): Promise<any> {
        const userEntity: UserEntity = await this.userService.getUserById(user);
        const shopEntity: ShopEntity = await this.shopService.getShopById(shop);

        if (!userEntity || !shopEntity) {
            return {
                message: 'User or Shop not found',
            };
        }

        const order = new OrderEntity();
        order.user = userEntity;
        order.address = address;
        order.shop = shopEntity.id;
        order.total = 0;
        order.status = 0;
        order.createdAt = new Date();
        order.updatedAt = new Date();
        order.deletedAt = false;

        const response = await this.orderRepository.save(order);

        userEntity.orders = [...userEntity.orders, order];
        await this.userRepository.save(userEntity);

        const { products, shop: shopResponse, user: userResponse, ...rest } = response;
        return rest;
    }

    async getAllOrder(): Promise<OrderEntity[]> {
        return await this.orderRepository.find({
            relations: ['user', 'products'],
        });
    }

    async getOrderById(id: number): Promise<OrderEntity> {
        return await this.orderRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['user', 'products', 'products.product'],
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
        product.explored += count;
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

    async createOrder({ user, address, products, shop, gifts }: CreateOrderDto): Promise<any> {
        const order = await this.newOrder({ user, address, shop });
        const orderResponse = await this.getOrderById(order.id);
        const giftEntity = await this.giftService.findGiftById(gifts);

        if (giftEntity) {
            // remove gift from user
            const userEntity = await this.userService.getUserById(user);
            userEntity.gifts = userEntity.gifts.filter((gift) => gift.id !== giftEntity.id);
            await this.userRepository.save(userEntity);
        }

        for (const product of products) {
            await this.addProductToOrder({
                orderId: orderResponse.id,
                productId: product.id,
                count: product.quantity,
                shopId: shop,
            });
        }

        const response = await this.getOrderById(orderResponse.id);

        const { createdAt, updatedAt, deletedAt, user: userResponse, products: productsResponse, ...rest } = response;
        return {
            ...rest,
        };
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
        // status == 3
        if (status === getConfig().ORDER_STATUS.DELIVERED) {
            // create history
            await this.historyService.createHistory({
                userId: order.user.id,
                orderId: order.id,
            });

            // delete order from user
            const userEntity = await this.userRepository.findOne({
                where: { id: order.user.id },
                relations: ['orders', 'balance'],
            });

            order.deletedAt = true;
            order.updatedAt = new Date();
            await this.orderRepository.save(order);

            userEntity.orders = userEntity.orders.filter((item) => {
                return item.id !== order.id;
            });
            await this.userRepository.save(userEntity);

            const {
                balance: { id },
            } = userEntity;

            const balanceEntity = await this.balanceRepository.findOne({
                where: { id },
            });

            balanceEntity.amount -= order.total;
            await this.balanceRepository.save(balanceEntity);

            return {
                message: 'Order delivered',
            };
        }

        order.status = status;
        order.updatedAt = new Date();
        return await this.orderRepository.save(order);
    }

    async addProductOrder({ product, order, shop, count }): Promise<any> {
        const orderEntity: OrderEntity = await this.getOrderById(order);
        const productEntity: ProductEntity = await this.productService.findProductById(product);
        const shopProductEntity: ShopProductEntity = await this.shopProductRepository
            .createQueryBuilder('shop_product')
            .leftJoinAndSelect('shop_product.product', 'product')
            .leftJoinAndSelect('shop_product.shop', 'shop')
            .where('shop_product.product = :productId', { productId: product })
            .andWhere('shop_product.shop = :shopId', { shopId: shop })
            .getOne();

        if (!orderEntity || !productEntity || !shopProductEntity) {
            return {
                message: 'Order or Product or Shop product not found',
                error: true,
            };
        }

        if (shopProductEntity.quantity < count) {
            return {
                message: 'Not enough quantity',
                error: true,
            };
        }

        shopProductEntity.quantity -= count;
        await this.shopProductRepository.save(shopProductEntity);

        // check product in order
        const orderToProductEntity = await this.orderToProductRepository
            .createQueryBuilder('order_to_product')
            .leftJoinAndSelect('order_to_product.order', 'order')
            .leftJoinAndSelect('order_to_product.product', 'product')
            .where('order_to_product.order = :orderId', { orderId: order })
            .andWhere('order_to_product.product = :productId', { productId: product })
            .getOne();

        // if product in order
        if (orderToProductEntity) {
            // if decrease count => delete product from order
            if (orderToProductEntity.count + count <= 0) {
                await this.orderToProductRepository.remove(orderToProductEntity);
                orderEntity.products = orderEntity.products.filter((item) => {
                    return item.id !== orderToProductEntity.id;
                });
                orderEntity.total -= orderToProductEntity.total;
                await this.orderRepository.save(orderEntity);
                const response = await this.getOrderById(order);
                const { products, ...rest } = response;
                return {
                    ...rest,
                    products: products.map((item) => {
                        const { order, product, ...rest } = item;
                        return {
                            ...rest,
                            products: products.map((item) => {
                                const { order, product, ...rest } = item;
                                return rest;
                            }),
                        };
                    }),
                };
            }

            orderToProductEntity.count += count;
            orderToProductEntity.total += productEntity.price * count;
            await this.orderToProductRepository.save(orderToProductEntity);
            await this.orderRepository.save(orderEntity);
            const response = await this.getOrderById(order);
            const { products, ...rest } = response;
            return {
                ...rest,
                products: products.map((item) => {
                    const { order, product, ...rest } = item;
                    const { comments, orders, shops, ...restProduct } = product;
                    return {
                        ...rest,
                        product: restProduct,
                    };
                }),
            };
        }

        const orderToProduct = new OrderToProductEntity();
        orderToProduct.order = orderEntity;
        orderToProduct.product = productEntity;
        orderToProduct.count = count;
        orderToProduct.price = productEntity.price;
        orderToProduct.total = productEntity.price * count;
        orderToProduct.createdAt = new Date();
        orderToProduct.updatedAt = new Date();
        orderToProduct.deletedAt = false;
        await this.orderToProductRepository.save(orderToProduct);

        orderEntity.products.push(orderToProduct);
        orderEntity.total += orderToProduct.total;
        const response = await this.orderRepository.save(orderEntity);

        productEntity.orders.push(orderToProduct);
        productEntity.explored += count;
        await this.productRepository.save(productEntity);

        const { products, ...rest } = response;
        return {
            ...rest,
            products: products.map((item) => {
                const { order, product, ...rest } = item;
                return rest;
            }),
        };
    }

    async updateProductOfOrder({ product, order, shop, count, address, user }): Promise<any> {
        const orderEntity: OrderEntity = await this.getOrderById(order);
        if (orderEntity) {
            const response = await this.addProductOrder({ product, order, shop, count });
            return response;
        }
        const orderResponse = await this.newOrder({ user, address, shop });
        const response = await this.addProductOrder({ product, order: orderResponse.id, shop, count });
        return response;
    }
}
