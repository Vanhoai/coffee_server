import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageEntity } from './image.entity';

export class ImageService {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        private readonly cloudinary: CloudinaryService,
    ) {}

    async uploadImageToCloudinary(file: Express.Multer.File) {
        return await this.cloudinary.uploadFileImage(file).catch(() => {
            throw new BadRequestException('Invalid file type.');
        });
    }

    async createImage(file: Express.Multer.File): Promise<ImageEntity> {
        const image = new ImageEntity();
        const response = await this.uploadImageToCloudinary(file);
        const { url, public_id, width, height, format, signature, secure_url } = response;
        image.url = url;
        image.publicId = public_id;
        image.width = width;
        image.height = height;
        image.format = format;
        image.signature = signature;
        image.secureUrl = secure_url;
        return await this.imageRepository.save(image);
    }

    async find(): Promise<ImageEntity[]> {
        return await this.imageRepository.find();
    }

    async findOne(id: number): Promise<ImageEntity> {
        return await this.imageRepository.findOne({
            where: {
                id,
            },
        });
    }

    async deleteSoftImage(id: number): Promise<ImageEntity> {
        const image = await this.findOne(id);
        if (!image) {
            throw new BadRequestException('Image not found');
        }
        image.deletedAt = true;
        return await this.imageRepository.save(image);
    }

    async deleteImage(id: number): Promise<ImageEntity> {
        const image = await this.findOne(id);
        if (!image) {
            throw new BadRequestException('Image not found');
        }
        const { publicId } = image;
        await this.imageRepository.delete(id);
        await this.cloudinary.deleteFileImage(publicId);
        return image;
    }

    async deleteAllImage(): Promise<ImageEntity[]> {
        const images = await this.find();
        await this.imageRepository.delete({});
        return images;
    }

    async changeImage(id: number, file: Express.Multer.File): Promise<ImageEntity> {
        const image = await this.findOne(id);
        if (!image) {
            throw new BadRequestException('Image not found');
        }
        const { publicId } = image;
        await this.cloudinary.deleteFileImage(publicId);
        const { url, public_id } = await this.uploadImageToCloudinary(file);
        image.url = url;
        image.publicId = public_id;
        return await this.imageRepository.save(image);
    }
}
