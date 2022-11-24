import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopService } from 'src/features/shops/services/shop.service';
import { Repository } from 'typeorm';
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

    async getAllProduct(): Promise<any> {
        const response = await this.productRepository.find({
            relations: ['image'],
        });
        return response.map((product) => {
            const { image, createdAt, updatedAt, deletedAt, ...rest } = product;
            return {
                ...rest,
                image: image?.url,
            };
        });
    }

    async getProductByOptions({ limit, skip, sort, field }): Promise<any> {
        const response = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.image', 'image')
            .orderBy(`product.${field || 'id'}`, sort)
            .limit(limit)
            .skip(skip)
            .getMany();

        return response.map((product) => {
            const { image, createdAt, updatedAt, deletedAt, ...rest } = product;
            return {
                ...rest,
                image: image?.url,
            };
        });
    }

    async getDetailProduct(id: number): Promise<any> {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id },
            relations: ['image', 'comments', 'comments.user', 'comments.user.image'],
        });

        const { image, comments, createdAt, updatedAt, deletedAt, ...rest } = product;
        return {
            ...rest,
            image: image?.url,
            comments: comments.map((comment) => {
                const { user, createdAt, updatedAt, deletedAt, ...rest } = comment;
                const {
                    image,
                    password,
                    createdAt: createdAtUser,
                    updatedAt: updatedAtUser,
                    deletedAt: deletedAtUser,
                    ...restUser
                } = user;
                return {
                    ...rest,
                    user: {
                        ...restUser,
                        image: image?.url || null,
                    },
                };
            }),
        };
    }
}
