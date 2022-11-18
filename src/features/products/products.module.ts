import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { ProductController } from './controllers/product.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './services/product.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, ImageEntity])],
    controllers: [ProductController],
    providers: [ProductService, ImageService, CloudinaryService],
    exports: [],
})
export class ProductModule {}
