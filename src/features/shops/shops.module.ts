import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { ShopController } from './controllers/shop.controller';
import { ShopEntity } from './entities/shop.entity';
import { ShopService } from './services/shop.service';

@Module({
    imports: [TypeOrmModule.forFeature([ShopEntity, ImageEntity])],
    controllers: [ShopController],
    providers: [ShopService, ImageService, CloudinaryService],
    exports: [],
})
export class ShopModule {}
