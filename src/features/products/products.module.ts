import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { ShopProductEntity } from '../shops/entities/shop-product.entity';
import { ShopEntity } from '../shops/entities/shop.entity';
import { ShopService } from '../shops/services/shop.service';
import { ProductController } from './controllers/product.controller';
import { ProductsController } from './controllers/products.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './services/product.service';
import { ProductsService } from './services/products.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, ImageEntity, ShopProductEntity, ShopEntity])],
    controllers: [ProductController, ProductsController],
    providers: [ProductService, ImageService, CloudinaryService, ProductsService, ShopService],
    exports: [],
})
export class ProductModule {}
