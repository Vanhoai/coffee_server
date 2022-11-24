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
        @InjectRepository(ShopProductEntity)
        private readonly shopProductRepository: Repository<ShopProductEntity>,
        @InjectRepository(ShopEntity)
        private readonly shopRepository: Repository<ShopEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly shopService: ShopService,
        private readonly productService: ProductService,
    ) {}

    async getProductFromShop(id: number): Promise<ShopProductEntity> {
        const shop = await this.shopProductRepository.findOne({
            where: { id },
            relations: ['shops', 'products'],
        });
        if (!shop) return null;
        return shop;
    }

    async getShopProductById(id: number): Promise<ShopProductEntity> {
        const shopProduct = await this.shopProductRepository.findOne({
            where: { id },
            relations: ['shop', 'product'],
        });
        if (!shopProduct) return null;
        return shopProduct;
    }

    async addProductToShop({ shop, product, quantity }: AddProductToShopDto): Promise<any> {
        const shopEntity = await this.shopService.findById(+shop);
        const productEntity = await this.productService.findProductById(+product);
        if (!shopEntity || !productEntity) return null;

        productEntity.quantity -= quantity;

        const shopProduct = new ShopProductEntity();
        shopProduct.shop = shopEntity;
        shopProduct.product = productEntity;
        shopProduct.quantity = quantity;
        shopProduct.createdAt = new Date();
        shopProduct.updatedAt = new Date();
        shopProduct.deletedAt = false;

        await this.shopProductRepository.save(shopProduct);

        shopEntity.products.push(shopProduct);
        productEntity.shops.push(shopProduct);

        await this.shopRepository.save(shopEntity);
        await this.productRepository.save(productEntity);

        return shopProduct;
    }

    async getAllShopProduct(): Promise<any> {
        const [shopProducts, count] = await Promise.all([
            this.shopProductRepository.find({
                relations: ['shop', 'product'],
            }),
            this.shopProductRepository.count({}),
        ]);
        return {
            count,
            shopProduct: shopProducts.filter((shopProduct) => !shopProduct.deletedAt),
        };
    }

    async getAll(): Promise<ShopProductEntity[]> {
        return await this.shopProductRepository.find({
            relations: ['shop', 'product'],
        });
    }
}
