import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopService } from 'src/features/shops/services/shop.service';
import { Repository } from 'typeorm';
import { AddProductToShopDto } from '../dtos/AddProductToShop.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductService } from './product.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly shopService: ShopService,
        private readonly productService: ProductService,
    ) {}

    async addProductToShop({ product, shop, quantity }: AddProductToShopDto): Promise<any> {
        const productEntity = await this.productService.findProductById(product);
        if (!productEntity) return null;

        const shopEntity = await this.shopService.getShopById(shop);
        if (!shopEntity) return null;
    }
}
