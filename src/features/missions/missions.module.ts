import { Module } from '@nestjs/common';
import { MissionController } from './controllers/mission.controller';
import { MissionService } from './services/mission.service';

@Module({
    imports: [],
    controllers: [MissionController],
    providers: [MissionService],
    exports: [],
})
export class MissionModule {}
