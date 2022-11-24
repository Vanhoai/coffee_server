import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConfig } from 'src/config';
import { HistoryService } from 'src/features/histories/services/history.service';
import { ImageService } from 'src/features/images/image.service';
import { ProductService } from 'src/features/products/services/product.service';
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
        private readonly productService: ProductService,
    ) {}

    async getAllCustomer(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            relations: [
                'histories',
                'favoriteShops',
                'gifts',
                'orders',
                'image',
                'orders.shops',
                'orders.gifts',
                'orders.products',
            ],
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

    async updateBalance(id: number, amount: number, code: string): Promise<BalanceEntity> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['balance'],
        });

        const {
            balance: { id: balanceId },
        } = user;

        const balance = await this.balanceRepository
            .createQueryBuilder('balance')
            .where('balance.id = :id', { id: balanceId })
            .andWhere('balance.code = :code', { code })
            .getOne();

        if (!balance) {
            return null;
        }

        balance.amount += amount;

        return this.balanceRepository.save(balance);
    }

    async addProductToFavorite(id: number, product: number): Promise<UserEntity> {
        const userEntity = await this.userRepository.findOne({
            where: { id },
            relations: ['favoriteProducts'],
        });

        const productEntity = await this.productService.findProductById(product);
        userEntity.favoriteProducts.push(productEntity);
        return await this.userRepository.save(userEntity);
    }
}
