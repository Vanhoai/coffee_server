import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMissionDto } from '../dtos/CreateMission.dto';
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
        private readonly typeService: TypeService,
    ) {}

    async getAllMission(): Promise<MissionEntity[]> {
        return await this.missionRepository.find({
            relations: ['type', 'gifts'],
        });
    }

    async getMissionById(id: number): Promise<MissionEntity> {
        return await this.missionRepository.findOne({
            where: { id },
            relations: ['type', 'gifts'],
        });
    }

    async createMission({ mark, type }: CreateMissionDto): Promise<MissionEntity> {
        const typeEntity = await this.typeService.getTypeById(type);

        if (!typeEntity) {
            throw new Error('Type not found');
        }

        const mission = new MissionEntity();
        mission.mark = mark;
        mission.type = typeEntity;
        mission.createdAt = new Date();
        mission.updatedAt = new Date();
        mission.deletedAt = false;

        typeEntity.missions.push(mission);

        await this.typeRepository.save(typeEntity);

        return await this.missionRepository.save(mission);
    }
}
