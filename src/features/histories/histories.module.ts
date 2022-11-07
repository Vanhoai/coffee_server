import { Module } from '@nestjs/common';
import { HistoryController } from './controllers/history.controller';
import { HistoryService } from './services/history.service';

@Module({
    imports: [],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [],
})
export class HistoryModule {}
