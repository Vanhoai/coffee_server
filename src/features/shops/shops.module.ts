import { Module } from '@nestjs/common';
import { ShopController } from './controllers/shop.controller';
import { ShopService } from './services/shop.service';

@Module({
    imports: [],
    controllers: [ShopController],
    providers: [ShopService],
    exports: [],
})
export class ShopModule {}
