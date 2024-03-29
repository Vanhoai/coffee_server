import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeEntity } from 'src/features/missions/entities/type.entity';
import { TypeService } from 'src/features/missions/services/type.service';
import { UserService } from 'src/features/users/services/users.service';
import { Repository } from 'typeorm';
import { GiftEntity } from '../entities/gift.entity';

@Injectable()
export class GiftService {
    constructor(
        @InjectRepository(GiftEntity)
        private readonly giftRepository: Repository<GiftEntity>,
        @InjectRepository(TypeEntity)
        private readonly typeRepository: Repository<TypeEntity>,
        private readonly typeService: TypeService,
        private readonly userService: UserService,
    ) {}

    async getAllGifts(): Promise<any> {
        const gifts: GiftEntity[] = await this.giftRepository.find({
            relations: ['type'],
        });

        return gifts.filter((gift) => !gift.deletedAt);
    }

    async findGiftById(id: number): Promise<GiftEntity> {
        const gift: GiftEntity = await this.giftRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['type'],
        });

        return gift || null;
    }

    async createGift({ type, code, count, expiredAt, name }): Promise<GiftEntity> {
        const gift = new GiftEntity();
        const typeEntity = await this.typeService.getTypeById(type);

        gift.type = typeEntity;
        gift.code = code;
        gift.count = count;
        gift.expiredAt = expiredAt;
        gift.name = name;
        gift.createdAt = new Date();
        gift.updatedAt = new Date();
        gift.deletedAt = false;

        typeEntity.gifts.push(gift);

        await this.typeRepository.save(typeEntity);

        return await this.giftRepository.save(gift);
    }

    async updateGift(id: number, { type, code, count, expiredAt, name }): Promise<GiftEntity> {
        const gift = await this.giftRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['type'],
        });

        const typeEntity = await this.typeService.getTypeById(type);

        gift.type = typeEntity;
        gift.code = code;
        gift.count = count;
        gift.name = name;
        gift.expiredAt = expiredAt;
        gift.updatedAt = new Date();

        typeEntity.gifts.push(gift);

        await this.typeRepository.save(typeEntity);

        return await this.giftRepository.save(gift);
    }

    async deleteGift(id: number): Promise<GiftEntity> {
        const gift = await this.giftRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['type'],
        });

        gift.deletedAt = true;
        gift.updatedAt = new Date();

        return await this.giftRepository.save(gift);
    }

    async findGiftByCode(code: string): Promise<GiftEntity> {
        const gift = await this.giftRepository.findOne({
            where: { code, deletedAt: false },
            relations: ['type'],
        });

        return gift;
    }

    async removeGift(id: number): Promise<GiftEntity> {
        const gift = await this.giftRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['type'],
        });

        await this.giftRepository.remove(gift);

        return gift;
    }

    async getGiftOfUser(id: number): Promise<any> {
        const userEntity = await this.userService.getUserById(id);
        const response = userEntity.gifts.map((gift) => {
            const { createdAt, updatedAt, deletedAt, type, ...rest } = gift;
            const { createdAt: typeCreatedAt, updatedAt: typeUpdatedAt, deletedAt: typeDeletedAt, ...restType } = type;
            return {
                ...rest,
                type: restType,
            };
        });

        return response;
    }

    async removeGiftOfUser(id: number, giftId: number): Promise<any> {
        const userEntity = await this.userService.getUserById(id);
        const giftEntity = await this.findGiftById(giftId);

        userEntity.gifts = userEntity.gifts.filter((gift) => gift.id !== giftId);

        await this.userService.updateUser(id, userEntity);

        return giftEntity;
    }
}
