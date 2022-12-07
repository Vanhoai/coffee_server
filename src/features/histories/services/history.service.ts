import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from 'src/features/orders/services/order.service';
import { ShopService } from 'src/features/shops/services/shop.service';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { UserService } from 'src/features/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateHistoryDto } from '../dtos/CreateHistory.dto';
import { HistoryEntity } from '../entities/history.entity';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(HistoryEntity)
        private readonly historyRepository: Repository<HistoryEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly userService: UserService,
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService,
        private readonly shopService: ShopService,
    ) {}

    async getAllHistory(): Promise<HistoryEntity[]> {
        return await this.historyRepository.find({
            relations: ['user', 'order'],
        });
    }

    async getHistoryById(id: number): Promise<HistoryEntity> {
        return await this.historyRepository.findOne({
            where: { id },
            relations: ['user', 'order'],
        });
    }

    async createHistory({ orderId, userId }: CreateHistoryDto): Promise<HistoryEntity> {
        const user = await this.userService.getUserById(userId);
        const order = await this.orderService.getOrderById(orderId);

        if (!user) {
            throw new Error('User not found');
        }

        if (!order) {
            throw new Error('Order not found');
        }

        const history = new HistoryEntity();
        history.image = null;
        history.user = user;
        history.order = order;
        history.createdAt = new Date();
        history.updatedAt = new Date();
        history.deletedAt = false;

        user.histories = [...user.histories, history];

        await this.userRepository.save(user);

        return await this.historyRepository.save(history);
    }

    async deleteHistory(id: number): Promise<HistoryEntity> {
        const history = await this.getHistoryById(id);
        if (!history) {
            throw new Error('History not found');
        }

        history.deletedAt = true;
        history.updatedAt = new Date();

        return await this.historyRepository.save(history);
    }

    async restoreHistory(id: number): Promise<HistoryEntity> {
        const history = await this.getHistoryById(id);
        if (!history) {
            throw new Error('History not found');
        }

        history.deletedAt = false;
        history.updatedAt = new Date();

        return await this.historyRepository.save(history);
    }

    async removeHistory(id: number): Promise<HistoryEntity> {
        const history = await this.getHistoryById(id);
        if (!history) {
            throw new Error('History not found');
        }

        return await this.historyRepository.remove(history);
    }

    async getAllHistoryByUserId(id: number): Promise<any> {
        const user: UserEntity = await this.userService.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }

        const historiesEntity = await this.historyRepository
            .createQueryBuilder('history')
            .leftJoinAndSelect('history.user', 'user')
            .leftJoinAndSelect('history.order', 'order')
            .leftJoinAndSelect('order.products', 'productOrder')
            .leftJoinAndSelect('productOrder.product', 'product')
            .leftJoinAndSelect('product.image', 'image')
            .where('user.id = :userId', { userId: id })
            .andWhere('order.deletedAt = :deletedAt', { deletedAt: false })
            .getMany();

        const response = historiesEntity.map(async (history) => {
            const { id: idHistory, createdAt, updatedAt, deletedAt, user: userEntity, order } = history;

            const {
                createdAt: createdAtUser,
                updatedAt: updatedAtUser,
                deletedAt: deletedAtUser,
                ...userResponse
            } = userEntity;
            const {
                createdAt: createdAtOrder,
                updatedAt: updatedAtOrder,
                deletedAt: deletedAtOrder,
                shop,
                products,
                ...orderEntity
            } = order;

            const shopEntity = await this.shopService.getShopById(shop);

            const {
                createdAt: createdAtShop,
                updatedAt: updatedAtShop,
                deletedAt: deletedAtShop,
                products: productsShop,
                ...shopResponse
            } = shopEntity;

            return {
                id: idHistory,
                updatedAt,
                user: userResponse,
                order: {
                    ...orderEntity,
                    shop: shopResponse,
                    products: products.map((item) => {
                        const { createdAt, updatedAt, deletedAt, product, ...productResponse } = item;
                        const {
                            createdAt: createdAtProduct,
                            updatedAt: updatedAtProduct,
                            deletedAt: deletedAtProduct,
                            image,
                            ...productEntity
                        } = product;
                        return {
                            ...productResponse,
                            product: {
                                ...productEntity,
                                image: image ? image.url : null,
                            },
                        };
                    }),
                },
            };
        });

        return await Promise.all(response);
    }
}
