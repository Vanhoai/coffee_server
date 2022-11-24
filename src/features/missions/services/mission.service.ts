import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftService } from 'src/features/gifts/services/gift.service';
import { UserService } from 'src/features/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateMissionDto } from '../dtos/CreateMission.dto';
import { MissionUserEntity } from '../entities/mission-user.entity';
import { MissionEntity } from '../entities/mission.entity';
import { TypeEntity } from '../entities/type.entity';
import { TypeService } from './type.service';

@Injectable()
export class MissionService {
    constructor(
        @InjectRepository(MissionEntity)
        private readonly missionRepository: Repository<MissionEntity>,
        @InjectRepository(TypeEntity)
        private readonly typeRepository: Repository<TypeEntity>,
        @InjectRepository(MissionUserEntity)
        private readonly missionUserRepository: Repository<MissionUserEntity>,
        private readonly typeService: TypeService,
        private readonly userService: UserService,
        private readonly giftService: GiftService,
    ) {}

    async getAllMission(): Promise<MissionEntity[]> {
        return await this.missionRepository.find({
            relations: ['type', 'missionUsers', 'missionUsers.user'],
        });
    }

    async getMissionById(id: number): Promise<MissionEntity> {
        return await this.missionRepository.findOne({
            where: { id },
            relations: ['type', 'missionUsers'],
        });
    }

    async createMission({ mark, type, total }: CreateMissionDto): Promise<MissionEntity> {
        const typeEntity = await this.typeService.getTypeById(type);

        if (!typeEntity) {
            throw new Error('Type not found');
        }

        const mission = new MissionEntity();
        mission.mark = mark;
        mission.total = total;
        mission.type = typeEntity;
        mission.createdAt = new Date();
        mission.updatedAt = new Date();
        mission.deletedAt = false;

        typeEntity.missions.push(mission);

        await this.typeRepository.save(typeEntity);

        return await this.missionRepository.save(mission);
    }

    async registerMissionUser({ userId, missionId }: { userId: number; missionId: number }): Promise<any> {
        const userEntity = await this.userService.getUserById(userId);
        const missionEntity = await this.getMissionById(missionId);

        if (!userEntity) {
            return {
                message: 'User not found',
                error: true,
            };
        }

        if (!missionEntity) {
            return {
                message: 'Mission not found',
                error: true,
            };
        }

        const missionUser = new MissionUserEntity();
        missionUser.mission = missionEntity;
        missionUser.user = userEntity;
        missionUser.current = 0;
        missionUser.createdAt = new Date();
        missionUser.updatedAt = new Date();
        missionUser.deletedAt = false;

        userEntity.missionUsers.push(missionUser);
        missionEntity.missionUsers.push(missionUser);

        await this.missionUserRepository.save(missionUser);
        await this.missionRepository.save(missionEntity);

        return this.missionUserRepository.save(missionUser);
    }

    async updateMissionUser({
        userId,
        missionId,
        current,
    }: {
        userId: number;
        missionId: number;
        current: number;
    }): Promise<any> {
        const userEntity = await this.userService.getUserById(userId);
        const missionEntity = await this.getMissionById(missionId);

        if (!userEntity) {
            return {
                message: 'User not found',
                error: true,
            };
        }

        if (!missionEntity) {
            return {
                message: 'Mission not found',
                error: true,
            };
        }

        const missionUserEntity = await this.missionUserRepository
            .createQueryBuilder('mission_user')
            .leftJoinAndSelect('mission_user.user', 'user')
            .leftJoinAndSelect('mission_user.mission', 'mission')
            .where('user.id = :userId', { userId: userEntity.id })
            .andWhere('mission.id = :missionId', { missionId: missionEntity.id })
            .getOne();

        if (!missionUserEntity) {
            return {
                message: 'Mission user not found',
                error: true,
            };
        }

        const { total } = missionEntity;
        const { current: currentMissionUser } = missionUserEntity;

        if (currentMissionUser + current >= total) {
            await this.missionUserRepository.remove(missionUserEntity);
            userEntity.exp += missionEntity.mark;
            const gift = await this.giftService.createGift({
                code: this.generateCode(10),
                count: 1,
                type: missionEntity.type.id,
                expiredAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            });
            userEntity.gifts.push(gift);
            await this.userService.updateUser(userEntity.id, userEntity);
        } else {
            missionUserEntity.current += current;
            await this.missionUserRepository.save(missionUserEntity);
        }

        return await this.missionUserRepository.save(missionUserEntity);
    }

    generateCode(length: number): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
