import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../orders/entities/order.entity';
import { MissionController } from './controllers/mission.controller';
import { MissionEntity } from './entities/mission.entity';
import { TypeEntity } from './entities/type.entity';
import { MissionService } from './services/mission.service';
import { TypeService } from './services/type.service';

@Module({
    imports: [TypeOrmModule.forFeature([MissionEntity, TypeEntity, OrderEntity])],
    controllers: [MissionController],
    providers: [MissionService, TypeService],
    exports: [],
})
export class MissionModule {}
