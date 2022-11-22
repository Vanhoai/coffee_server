import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEntity } from '../missions/entities/type.entity';
import { TypeService } from '../missions/services/type.service';
import { GiftController } from './controllers/gift.controller';
import { GiftEntity } from './entities/gift.entity';
import { GiftService } from './services/gift.service';

@Module({
    imports: [TypeOrmModule.forFeature([GiftEntity, TypeEntity])],
    controllers: [GiftController],
    providers: [GiftService, TypeService],
    exports: [],
})
export class GiftModule {}
