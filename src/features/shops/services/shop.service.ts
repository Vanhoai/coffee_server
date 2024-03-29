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

    async getAllShop(): Promise<any> {
        let shops: ShopEntity[] = await this.shopRepository.find({
            relations: ['image', 'products'],
        });
        shops = shops.filter((shop) => !shop.deletedAt);
        const result = shops.map((shop) => {
            return {
                id: shop.id,
                location: shop.location,
                description: shop.description,
                longitude: shop.longitude,
                latitude: shop.latitude,
                image: shop.image.url,
                products: shop.products,
            };
        });

        return result;
    }

    async findById(id: number): Promise<ShopEntity> {
        return await this.shopRepository.findOne({
            where: { id },
            relations: ['image', 'products', 'products.product', 'products.product.image'],
        });
    }

    async getShopById(id: number): Promise<any> {
        const shop: ShopEntity = await this.shopRepository.findOne({
            where: { id },
            relations: ['image', 'products', 'products.product', 'products.product.image'],
        });
        if (!shop) {
            return {};
        }
        const { image, products, createdAt, updatedAt, deletedAt, ...restShop } = shop;

        return {
            ...restShop,
            image: image.url,
            products: products.map((product) => {
                const { product: productDetail, createdAt, updatedAt, deletedAt, ...restProduct } = product;
                const {
                    image: productImage,
                    createdAt: productCreatedAt,
                    updatedAt: productUpdatedAt,
                    deletedAt: productDeletedAt,
                    ...restProductDetail
                } = productDetail;
                return {
                    ...restProduct,
                    product: {
                        ...restProductDetail,
                        image: productImage.url,
                    },
                };
            }),
        };
    }

    async createShop({ location, description, longitude, latitude, file }: CreateShopDto): Promise<ShopEntity> {
        const image = await this.imageService.createImage(file, 'shops');
        const shop = new ShopEntity();
        shop.location = location;
        shop.description = description;
        shop.longitude = longitude;
        shop.latitude = latitude;
        shop.products = [];
        shop.image = image;
        shop.createdAt = new Date();
        shop.updatedAt = new Date();
        shop.deletedAt = false;
        return await this.shopRepository.save(shop);
    }

    async updateShop(id: number, shopUpdate: UpdateShopDto): Promise<ShopEntity> {
        const shop = await this.getShopById(id);
        if (!shop) return null;
        const {
            image: { id: imageId },
        } = shop;
        const { file, ...params } = shopUpdate;
        const image = await this.imageService.changeImage(imageId, file, 'shops');
        const updatedShop = await this.shopRepository.save({ ...shop, ...params, image, updatedAt: new Date() });
        return updatedShop;
    }

    async deleteSoftShop(id: number): Promise<ShopEntity> {
        const shop = await this.getShopById(id);
        if (!shop) return null;
        const {
            image: { id: imageId },
        } = shop;
        shop.deletedAt = true;
        await this.imageService.deleteSoftImage(imageId);
        return await this.shopRepository.save(shop);
    }

    async removeShop(id: number): Promise<any> {
        const shop = await this.getShopById(id);
        if (!shop) return null;
        const {
            image: { id: imageId },
        } = shop;
        const shopDelete = await this.shopRepository.remove(shop);
        await this.imageService.deleteImage(imageId);
        return shopDelete;
    }
}
