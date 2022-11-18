import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageService } from 'src/features/images/image.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/CreateProduct.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly imageService: ImageService,
    ) {}

    async createProduct({ name, price, quantity, image: file }: CreateProductDto): Promise<ProductEntity> {
        const product = new ProductEntity();
        product.name = name;
        product.price = price;
        product.quantity = quantity;
        product.explored = 0;
        product.comments = [];
        product.orders = [];
        product.createdAt = new Date();
        product.updatedAt = new Date();
        product.deletedAt = false;

        const image = await this.imageService.createImage(file);
        product.image = image;

        return await this.productRepository.save(product);
    }
}
