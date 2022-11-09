import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublicUserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getAll(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            relations: ['histories', 'favoriteShops', 'gifts', 'orders'],
        });
    }
}
