import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConfig } from 'src/config';
import { HistoryService } from 'src/features/histories/services/history.service';
import { ImageService } from 'src/features/images/image.service';
import { Repository } from 'typeorm';
import { UpdateImageDto } from '../dtos/UpdateImage.dto';
import { BalanceEntity } from '../entities/balance.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(BalanceEntity)
        private readonly balanceRepository: Repository<BalanceEntity>,
        private readonly imageService: ImageService,
    ) {}

    async getAllCustomer(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            where: { role: getConfig().ROLE.CUSTOMER },
            relations: ['histories', 'favoriteShops', 'gifts', 'orders', 'image'],
        });
    }

    async getUserById(id: number): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['histories', 'favoriteShops', 'gifts', 'orders', 'image'],
        });
    }

    async getAllUser(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            relations: ['histories', 'favoriteShops', 'gifts', 'orders', 'image'],
        });
    }

    async uploadAvatar({ id: userId, file }: UpdateImageDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const { image } = user;
        if (image) {
            await this.imageService.deleteImage(image.id);
        }

        const newImage = await this.imageService.createImage(file, 'users');
        user.image = newImage;

        return await this.userRepository.save(user);
    }

    // async addHistoryToUser(userId: number, historyId: number): Promise<UserEntity> {
    //     const user = await this.getUserById(userId);
    //     const history = await this.historyService.getHistoryById(historyId);

    //     if (!user) {
    //         throw new Error('User not found');
    //     }

    //     if (!history) {
    //         throw new Error('History not found');
    //     }

    //     user.histories.push(history);

    //     return await this.userRepository.save(user);
    // }
}
