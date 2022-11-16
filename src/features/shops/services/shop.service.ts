import { BadRequestException, ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/features/cloudinary/cloudinary.service';
import { ImageService } from 'src/features/images/image.service';
import { Repository } from 'typeorm';
import { CreateShopDto } from '../dtos/CreateShop.dto';
import { UpdateShopDto } from '../dtos/UpdateShop.dto';
import { ShopEntity } from '../entities/shop.entity';

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(ShopEntity)
        private readonly shopRepository: Repository<ShopEntity>,
        private readonly imageService: ImageService,
    ) {}

    async getAllShop(): Promise<ShopEntity[]> {
        return await this.shopRepository.find({
            relations: ['image', 'products'],
        });
    }

    async getShopById(id: number): Promise<ShopEntity> {
        const shop = await this.shopRepository.findOne({
            where: { id },
            relations: ['image', 'products'],
        });
        if (!shop) {
            throw new BadRequestException('Shop not found');
        }
        return shop;
    }

    async createShop({ location, description, longitude, latitude, file }: CreateShopDto): Promise<ShopEntity> {
        const image = await this.imageService.createImage(file);
        const shop = new ShopEntity();
        shop.location = location;
        shop.description = description;
        shop.longitude = longitude;
        shop.latitude = latitude;
        shop.products = [];
        // error here
        // shop.image = image;
        return await this.shopRepository.save(shop);
    }

    async updateShop(id: number, shopUpdate: UpdateShopDto): Promise<ShopEntity> {
        const shop = await this.getShopById(id);
        if (!shop) return null;
        const { file, ...rest } = shopUpdate;
        if (file) {
            const image = await this.imageService.createImage(file);
            shop.image = image;
        }
        return await this.shopRepository.save(shop);
    }
}
