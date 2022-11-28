import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftService } from 'src/features/gifts/services/gift.service';
import { UserService } from 'src/features/users/services/users.service';
import { GenerateFunction } from 'src/utils/GenerateFunction';
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

    async getAllMission({ limit, skip, field }): Promise<any> {
        const response = await this.missionRepository
            .createQueryBuilder('mission')
            .leftJoinAndSelect('mission.type', 'type')
            .leftJoinAndSelect('mission.missionUsers', 'missionUsers')
            .leftJoinAndSelect('missionUsers.user', 'user')
            .skip(skip || 0)
            .limit(limit || 10)
            .orderBy(`mission.${field || 'id'}`, 'ASC')
            .getManyAndCount();

        return {
            total: response[1],
            missions: response[0].map((mission) => {
                return mission;
            }),
        };
    }

    async getMissionById(id: number): Promise<MissionEntity> {
        return await this.missionRepository.findOne({
            where: { id },
            relations: ['type', 'missionUsers'],
        });
    }

    async createMission({ mark, type, total, description }): Promise<any> {
        const typeEntity = await this.typeService.getTypeById(type);

        if (!typeEntity) {
            return {
                message: 'Type not found',
                error: true,
            };
        }

        const percent = typeEntity.percent;

        const mission = new MissionEntity();
        mission.mark = mark;
        mission.total = total;
        mission.name = `Sale ${percent}%`;
        mission.description = description;
        mission.type = typeEntity;
        mission.expiredAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
        mission.createdAt = new Date();
        mission.updatedAt = new Date();
        mission.deletedAt = false;

        typeEntity.missions.push(mission);

        await this.typeRepository.save(typeEntity);

        const result = await this.missionRepository.save(mission);
        const { type: typeResponse, ...rest } = result;
        return {
            ...rest,
            type: typeResponse.id,
        };
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

        const response = await this.missionUserRepository.save(missionUser);
        const { mission, user, ...rest } = response;
        return {
            ...rest,
            user: user.id,
            mission: mission.id,
        };
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

        const {
            total,
            type: { percent },
        } = missionEntity;
        const { current: currentMissionUser } = missionUserEntity;

        // check if current is greater than total => create gift
        if (currentMissionUser + current >= total) {
            userEntity.exp += missionEntity.mark;
            const gift = await this.giftService.createGift({
                code: GenerateFunction.generateCode(10),
                count: 1,
                name: `Sale ${percent}%`,
                type: missionEntity.type.id,
                expiredAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            });
            userEntity.gifts.push(gift);

            // delete mission user
            missionUserEntity.deletedAt = true;
            await this.missionUserRepository.save(missionUserEntity);

            // remove mission user in mission
            userEntity.missionUsers = userEntity.missionUsers.filter((missionUser) => {
                return missionUser.id !== missionUserEntity.id;
            });

            // remove mission user in user
            missionEntity.missionUsers = missionEntity.missionUsers.filter((missionUser) => {
                return missionUser.id !== missionUserEntity.id;
            });

            // save mission
            await this.missionRepository.save(missionEntity);

            // save user
            await this.userService.updateUser(userEntity.id, userEntity);
        } else {
            // if current is less than total => update current
            missionUserEntity.current += current;
            await this.missionUserRepository.save(missionUserEntity);
        }

        return {
            message: 'Update mission user success',
            error: false,
        };
    }

    async deleteMission(id: number): Promise<any> {
        const mission = await this.getMissionById(id);
        if (!mission) {
            return {
                message: 'Mission not found',
                error: true,
            };
        }

        return this.missionRepository.remove(mission);
    }

    async getInformationMissionUser(userId: number, { limit, skip, field }): Promise<any> {
        const response = await Promise.all([
            this.userService.getUserById(userId),
            this.getAllMission({ limit, skip, field }),
            this.missionUserRepository
                .createQueryBuilder('mission_user')
                .andWhere('mission_user.user = :userId', { userId })
                .getCount(),
        ]);

        const [user, missions, count] = response;

        if (!user || !missions || !count) {
            return {
                totalGift: 0,
                totalMission: 0,
                totalMissionProgress: 0,
                listGifts: [],
                listMissions: [],
            };
        }

        const totalGiftOfUser = user.gifts.length;
        const listGiftOfUser = user.gifts.map((gift) => {
            const { createdAt, updatedAt, deletedAt, type, ...rest } = gift;
            const { createdAt: createdAtType, updatedAt: updatedAtType, deletedAt: deletedAtType, ...restType } = type;
            return {
                ...rest,
                type: {
                    ...restType,
                },
            };
        });

        const { total: totalMission, missions: missionsResponse } = missions;
        return {
            totalGift: totalGiftOfUser,
            totalMission,
            totalMissionProgress: count,
            listGifts: listGiftOfUser,
            listMissions: missionsResponse.map((mission) => {
                const { createdAt, updatedAt, deletedAt, type, missionUsers, ...rest } = mission;
                let current = 0;
                if (missionUsers.length > 0) {
                    const userMission = missionUsers.find((missionUser) => {
                        return missionUser.user.id === userId;
                    });
                    if (userMission) {
                        current = userMission.current;
                    }
                }
                const {
                    createdAt: createdAtType,
                    updatedAt: updatedAtType,
                    deletedAt: deletedAtType,
                    ...restType
                } = type;
                return {
                    ...rest,
                    current,
                    type: {
                        ...restType,
                    },
                };
            }),
        };
    }

    async getInformationMission({ skip, limit, field }): Promise<any> {
        const response = await Promise.all([
            await this.missionRepository
                .createQueryBuilder('mission')
                .leftJoinAndSelect('mission.type', 'type')
                .orderBy(`mission.'expiredAt'}`, 'ASC')
                .getOne(),
            await this.missionRepository
                .createQueryBuilder('mission')
                .leftJoinAndSelect('mission.type', 'type')
                .orderBy(`mission.${field || 'expiredAt'}`, 'ASC')
                .skip(skip)
                .limit(limit)
                .getMany(),
        ]);

        const [hottest, missions] = response;
        return {
            hottest,
            missions,
        };
    }
}
