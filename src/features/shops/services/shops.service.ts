import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageService } from 'src/features/images/image.service';
import { Repository } from 'typeorm';
import { ShopEntity } from '../entities/shop.entity';

@Injectable()
export class ShopsService {
    constructor(
        @InjectRepository(ShopEntity)
        private readonly shopRepository: Repository<ShopEntity>,
    ) {}

    async getAllShop(): Promise<any> {
        const response = await this.shopRepository.find({
            relations: ['image'],
        });
        return response.map((shop) => {
            const { image, createdAt, updatedAt, deletedAt, ...rest } = shop;
            return {
                ...rest,
                image: image?.url,
            };
        });
    }

    async getShopByOptions({ limit, skip, sort, field }): Promise<any> {
        const response = await this.shopRepository
            .createQueryBuilder('shop')
            .leftJoinAndSelect('shop.image', 'image')
            .orderBy(`shop.${field || 'id'}`, sort)
            .skip(skip)
            .limit(limit)
            .getMany();

        return response.map((shop) => {
            const { image, createdAt, updatedAt, deletedAt, ...rest } = shop;
            return {
                ...rest,
                image: image?.url,
            };
        });
    }

    async getAllProductOfShop(id: number): Promise<any> {
        // get shop and image of shop and product of shop
        const response = await this.shopRepository.find({
            where: { id },
            relations: ['image', 'products', 'products.product', 'products.product.image'],
        });

        const shop = response[0];
        const { image, createdAt, updatedAt, deletedAt, ...rest } = shop;
        return {
            ...rest,
            image: image?.url,
            products: shop.products.map((item) => {
                const { product, createdAt, updatedAt, deletedAt, ...rest } = item;
                const {
                    image,
                    createdAt: createdAtProduct,
                    updatedAt: updatedAtProduct,
                    deletedAt: deletedAtProduct,
                    ...restProduct
                } = product;
                return {
                    ...rest,
                    product: {
                        ...restProduct,
                        image: image?.url,
                    },
                };
            }),
        };
    }
}
