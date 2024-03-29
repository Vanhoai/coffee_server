import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageService } from 'src/features/images/image.service';
import { ProductService } from 'src/features/products/services/product.service';
import { Repository } from 'typeorm';
import { UpdateImageDto } from '../dtos/UpdateImage.dto';
import { BalanceEntity } from '../entities/balance.entity';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

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
            relations: ['histories', 'favoriteShops', 'gifts', 'orders', 'image', 'orders.products'],
        });
    }

    async findOne(id: number): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['image', 'balance'],
        });
    }

    async getBalanceOfUser(id: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['balance'],
        });

        if (!user) {
            return {
                message: 'User not found',
            };
        }

        const { balance } = user;
        return balance;
    }

    async getUserById(id: number): Promise<UserEntity> {
        const response = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.image', 'image')
            .leftJoinAndSelect('user.balance', 'balance')
            .leftJoinAndSelect('user.gifts', 'gift')
            .leftJoinAndSelect('gift.type', 'type')
            .leftJoinAndSelect('user.orders', 'order')
            .leftJoinAndSelect('user.missionUsers', 'missionUser')
            .leftJoinAndSelect('user.histories', 'history')
            .leftJoinAndSelect('user.favoriteProducts', 'favoriteProduct')
            .where('user.id = :id', { id })
            .andWhere('order.deletedAt = :deletedAt', { deletedAt: false })
            .getOne();

        if (!response) {
            return await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.image', 'image')
                .leftJoinAndSelect('user.balance', 'balance')
                .leftJoinAndSelect('user.gifts', 'gift')
                .leftJoinAndSelect('gift.type', 'type')
                .leftJoinAndSelect('user.orders', 'order')
                .leftJoinAndSelect('user.histories', 'history')
                .leftJoinAndSelect('user.favoriteProducts', 'favoriteProduct')
                .leftJoinAndSelect('user.missionUsers', 'missionUser')
                .leftJoinAndSelect('missionUser.mission', 'mission')
                .where('user.id = :id', { id })
                .getOne();
        }

        return response;
    }

    async getAllUser(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            relations: ['histories', 'favoriteShops', 'gifts', 'orders', 'image'],
        });
    }

    async uploadAvatar({ id: userId, file }: UpdateImageDto): Promise<any> {
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

        await this.userRepository.save(user);

        const response = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['image', 'balance'],
        });

        const { image: avatar, ...rest } = response;
        return {
            ...rest,
            image: avatar ? avatar.url : null,
        };
    }

    async updateBalance(id: number, balance: number, code: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['balance'],
        });

        if (!user) {
            return {
                message: 'User not found',
            };
        }

        const {
            balance: { id: balanceId },
        } = user;

        const balanceEntity = await this.balanceRepository.findOne({
            where: { id: balanceId, code },
        });

        if (!balanceEntity) {
            return {
                message: 'Balance not found',
            };
        }

        balanceEntity.amount += balance;
        return await this.balanceRepository.save(balanceEntity);
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

    async updateUser(id: number, data: Partial<UserEntity>): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            return {
                message: 'User not found',
                error: new Error('User not found'),
            };
        }

        const updatedUser = Object.assign(user, data);

        return await this.userRepository.save(updatedUser);
    }

    async getGiftOfUser(id: number, { limit, skip, field }): Promise<any> {
        const response = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.gifts', 'gift')
            .leftJoinAndSelect('gift.type', 'type')
            .where('user.id = :id', { id })
            .skip(skip || 0)
            .limit(limit || 5)
            .orderBy(`gift.${field || 'id'}`, 'ASC')
            .getOne();

        const { gifts } = response;
        return gifts.map((gift) => {
            const { createdAt, updatedAt, deletedAt, type, ...rest } = gift;
            const { createdAt: typeCreatedAt, updatedAt: typeUpdatedAt, deletedAt: typeDeletedAt, ...restType } = type;
            return {
                ...rest,
                type: restType,
            };
        });
    }

    async getGiftToExpire(id: number, { limit, skip, field }): Promise<any> {
        const response = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.gifts', 'gift')
            .leftJoinAndSelect('gift.type', 'type')
            .where('user.id = :id', { id })
            .andWhere('gift.expiredAt > :date', { date: new Date() })
            .skip(skip || 0)
            .limit(limit || 5)
            .orderBy(`gift.${field || 'id'}`, 'ASC')
            .getOne();

        const { gifts, ...rest } = response;
        const result = {
            ...rest,
            gifts: gifts.map((gift) => {
                const { createdAt, updatedAt, deletedAt, expiredAt, type, ...restGift } = gift;
                const {
                    createdAt: typeCreatedAt,
                    updatedAt: typeUpdatedAt,
                    deletedAt: typeDeletedAt,
                    ...restType
                } = type;
                return {
                    ...restGift,
                    expiredAt: expiredAt.getTime(),
                    type: restType,
                };
            }),
        };

        return result.gifts;
    }

    async updatePhoneNumberForUser({ id, phone }: { id: number; phone: string }): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new Error('User not found');
        }

        user.phone = phone;
        user.updatedAt = new Date();

        return await this.userRepository.save(user);
    }

    async updateDeviceTokenForUser({ id, token }: { id: number; token: string }): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new Error('User not found');
        }

        user.deviceToken = token;
        user.updatedAt = new Date();

        return await this.userRepository.save(user);
    }

    async updateUserInformation({
        id,
        username,
        email,
        password,
    }: {
        id: number;
        email: string;
        username: string;
        password: string;
    }): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const salt: string = await bcrypt.genSalt(Number(10));
        const hashedPassword: string = await bcrypt.hash(password, salt);

        user.username = username;
        user.email = email;
        user.password = hashedPassword;
        user.updatedAt = new Date();

        return await this.userRepository.save(user);
    }
}
