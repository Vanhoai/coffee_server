import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageController } from './image.controller';
import { ImageEntity } from './image.entity';
import { ImageService } from './image.service';

@Module({
    imports: [TypeOrmModule.forFeature([ImageEntity])],
    controllers: [ImageController],
    providers: [ImageService, CloudinaryService],
    exports: [],
})
export class ImageModule {}
