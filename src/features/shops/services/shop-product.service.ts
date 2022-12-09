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
        if (!shopEntity || !productEntity)
            return {
                message: 'Shop or product not found',
            };
        if (quantity > productEntity.quantity)
            return {
                message: 'Quantity is greater than product quantity',
            };

        const shopProduct = await this.shopProductRepository
            .createQueryBuilder('shopProduct')
            .where('shopProduct.shopId = :shopId', { shopId: +shop })
            .andWhere('shopProduct.productId = :productId', { productId: +product })
            .getOne();

        productEntity.quantity -= quantity;
        await this.productRepository.save(productEntity);
        if (shopProduct) {
            shopProduct.quantity += quantity;
            await this.shopProductRepository.save(shopProduct);
            return {
                message: 'Update shop product successfully',
            };
        }

        const newShopProduct = new ShopProductEntity();
        newShopProduct.shop = shopEntity;
        newShopProduct.product = productEntity;
        newShopProduct.quantity = quantity;
        newShopProduct.createdAt = new Date();
        newShopProduct.updatedAt = new Date();
        newShopProduct.deletedAt = false;

        shopEntity.products.push(shopProduct);
        productEntity.shops.push(shopProduct);

        await this.shopRepository.save(shopEntity);
        await this.productRepository.save(productEntity);

        await this.shopProductRepository.save(newShopProduct);

        return this.shopProductRepository.findOne({
            where: { id: newShopProduct.id },
        });
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
