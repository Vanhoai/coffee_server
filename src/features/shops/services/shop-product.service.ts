import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductToShopDto } from 'src/features/products/dtos/AddProductToShop.dto';
import { ProductEntity } from 'src/features/products/entities/product.entity';
import { ProductService } from 'src/features/products/services/product.service';
import { Repository } from 'typeorm';
import { ShopProductEntity } from '../entities/shop-product.entity';
import { ShopEntity } from '../entities/shop.entity';
import { ShopService } from './shop.service';

@Injectable()
export class ShopProductService {
    constructor(
        @InjectRepository(ShopEntity)
        private readonly shopProductRepository: Repository<ShopProductEntity>,
        private readonly shopService: ShopService,
        private readonly productService: ProductService,
    ) {}

    async getAllProductFromShop(id: number): Promise<ShopProductEntity> {
        const shop = await this.shopProductRepository.findOne({
            where: { id },
            relations: ['shops', 'products'],
        });
        if (!shop) return null;
        return shop;
    }

    async addProductToShop({ shop, product, quantity }: AddProductToShopDto): Promise<any> {
        const shopEntity: ShopEntity = await this.shopService.getShopById(shop);
        const productEntity: ProductEntity = await this.productService.findProductById(product);
        if (!shopEntity || !productEntity) return null;

        productEntity.quantity -= quantity;

        const shopProduct = await this.shopProductRepository.save({
            quantity,
            shops: shopEntity,
            products: productEntity,
        });

        shopEntity.products.push(shopProduct);
        productEntity.shops.push(shopProduct);

        return shopProduct;
    }
}
