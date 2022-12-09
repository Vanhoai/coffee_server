import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { ShopController } from './controllers/shop.controller';
import { ShopEntity } from './entities/shop.entity';
import { ShopService } from './services/shop.service';
import { ShopProductEntity } from './entities/shop-product.entity';
import { ShopProductController } from './controllers/shop-product.controller';
import { ShopProductService } from './services/shop-product.service';
import { ProductService } from '../products/services/product.service';
import { ProductController } from '../products/controllers/product.controller';
import { ProductEntity } from '../products/entities/product.entity';
import { ShopsController } from './controllers/shops.controller';
import { ShopsService } from './services/shops.service';

@Module({
    imports: [TypeOrmModule.forFeature([ShopEntity, ImageEntity, ShopProductEntity, ProductEntity])],
    controllers: [ShopController, ShopProductController, ProductController, ShopsController],
    providers: [ShopService, ImageService, CloudinaryService, ShopProductService, ProductService, ShopsService],
    exports: [],
})
export class ShopModule {}
