import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTypeDto } from '../dtos/UpdateType.dto';
import { TypeEntity } from '../entities/type.entity';
import { CreateTypeParams } from '../interfaces/CreateTypeParams';

@Injectable()
export class TypeService {
    constructor(
        @InjectRepository(TypeEntity)
        private readonly typeRepository: Repository<TypeEntity>,
    ) {}

    async getAllType(): Promise<TypeEntity[]> {
        return await this.typeRepository.find({
            relations: ['missions', 'gifts'],
        });
    }

    async getTypeById(id: number): Promise<TypeEntity> {
        return await this.typeRepository.findOne({
            where: { id },
            relations: ['missions', 'gifts'],
        });
    }

    async createType({ percent }: CreateTypeParams): Promise<TypeEntity> {
        const type = new TypeEntity();
        type.percent = percent;
        type.createdAt = new Date();
        type.updatedAt = new Date();
        type.gifts = [];
        type.missions = [];
        type.deletedAt = false;

        return await this.typeRepository.save(type);
    }

    async updateType({ id, percent }: UpdateTypeDto): Promise<TypeEntity> {
        const type = await this.getTypeById(id);
        if (!type) {
            throw new Error('Type not found');
        }

        type.percent = percent;
        type.updatedAt = new Date();

        return await this.typeRepository.save(type);
    }

    async deleteType(id: number): Promise<TypeEntity> {
        const type = await this.getTypeById(id);
        if (!type) {
            throw new Error('Type not found');
        }

        type.deletedAt = true;
        type.updatedAt = new Date();

        return await this.typeRepository.save(type);
    }

    async restoreType(id: number): Promise<TypeEntity> {
        const type = await this.getTypeById(id);
        if (!type) {
            throw new Error('Type not found');
        }

        type.deletedAt = false;
        type.updatedAt = new Date();

        return await this.typeRepository.save(type);
    }

    async hardDeleteType(id: number): Promise<TypeEntity> {
        const type = await this.getTypeById(id);
        if (!type) {
            throw new Error('Type not found');
        }

        return await this.typeRepository.remove(type);
    }
}
