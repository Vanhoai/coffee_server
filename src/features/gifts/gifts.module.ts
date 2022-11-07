import { Module } from '@nestjs/common';
import { GiftController } from './controllers/gift.controller';
import { GiftService } from './services/gift.service';

@Module({
    imports: [],
    controllers: [GiftController],
    providers: [GiftService],
    exports: [],
})
export class GiftModule {}
