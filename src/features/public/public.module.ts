import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { PublicUserController } from './controllers/user.public.controller';
import { PublicUserService } from './services/user.public.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [PublicUserController],
    providers: [PublicUserService],
    exports: [],
})
export class PublicRoutes {}
