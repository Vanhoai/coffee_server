import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from 'src/features/orders/services/order.service';
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

    async createHistory({ imageId, orderId, userId }: CreateHistoryDto): Promise<HistoryEntity> {
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
}
