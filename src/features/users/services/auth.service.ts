import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from 'src/core/services/token.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { UserEntity } from '../entities/user.entity';
import { getConfig } from 'src/config';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { JWTPayload } from 'src/core/interfaces/JWTPayload';
import { url } from 'inspector';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private JWT: TokenService,
    ) {}

    async findByOption({ key, value }): Promise<UserEntity> {
        const response = await this.userRepository.findOne({ where: { [key]: value } });
        return response;
    }

    async createAdmin({ username, email, password }: CreateUserDto): Promise<UserEntity> {
        const isConflict = await this.findByOption({
            key: 'email',
            value: email,
        });
        if (isConflict) return null;

        const salt = await bcrypt.genSalt(Number(10));
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
            image: null,
            histories: [],
            role: getConfig().ROLE.ADMIN,
            favoriteShops: [],
            gifts: [],
            orders: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: false,
        });

        await this.userRepository.save(admin);

        return admin;
    }

    async register({ username, email, password }: CreateUserDto): Promise<UserEntity> {
        const isConflict = await this.findByOption({
            key: 'email',
            value: email,
        });

        if (isConflict) return null;

        const salt = await bcrypt.genSalt(Number(10));
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
            image: null,
            histories: [],
            favoriteShops: [],
            gifts: [],
            orders: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: false,
        });

        await this.userRepository.save(user);

        return user;
    }

    async login({ email, password }: LoginUserDto): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['image'],
        });
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        // sign access token
        const payload: JWTPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = await this.JWT.signAccessToken(payload);
        const refreshToken = await this.JWT.signRefreshToken(payload);

        const { password: pass, createdAt, updatedAt, deletedAt, image, ...response } = user;

        return {
            ...response,
            history: user.id,
            favorite: user.id,
            image: image ? image.url : null,
            accessToken,
            refreshToken,
        };
    }

    async refreshToken({ refreshToken }: { refreshToken: string }): Promise<any> {
        const payload = await this.JWT.verifyRefreshToken(refreshToken);
        if (!payload) return null;
        const { id, email, role } = payload;

        const newPayload: JWTPayload = {
            id,
            email,
            role,
        };

        const accessToken = await this.JWT.signAccessToken(newPayload);
        const newRefreshToken = await this.JWT.signRefreshToken(newPayload);

        const response = {
            accessToken,
            refreshToken: newRefreshToken,
        };
        return response;
    }
}
