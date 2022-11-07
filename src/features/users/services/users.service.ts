import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConfig } from 'src/config';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getAllCustomer(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            where: { role: getConfig().ROLE.CUSTOMER },
            relations: ['histories', 'favoriteShops', 'gifts', 'orders'],
        });
    }

    async getAllUser(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            relations: ['histories', 'favoriteShops', 'gifts', 'orders'],
        });
    }
}
