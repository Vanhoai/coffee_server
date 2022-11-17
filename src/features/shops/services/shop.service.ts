import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        shop.image = image;
        return await this.shopRepository.save(shop);
    }

    async updateShop(id: number, shopUpdate: UpdateShopDto): Promise<ShopEntity> {
        const shop = await this.getShopById(id);
        console.log({
            shop,
            ...shopUpdate,
        });
        return null;
    }
}
