import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from 'src/features/images/image.entity';
import { ImageService } from 'src/features/images/image.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/CreateProduct.dto';
import { UpdateProductDto } from '../dtos/UpdateProduct.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly imageService: ImageService,
    ) {}

    async getAllProducts(): Promise<any> {
        const shops: ProductEntity[] = await this.productRepository.find({
            relations: ['image', 'comments', 'orders', 'shops'],
        });

        return shops.filter((product) => !product.deletedAt);
    }

    async findProductById(id: number): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['image', 'comments', 'orders', 'shops', 'shops.shop'],
        });

        return product;
    }

    async createProductNoImage({ name, price, description, quantity }): Promise<ProductEntity> {
        const product = new ProductEntity();
        product.name = name;
        product.description = description;
        product.price = price;
        product.quantity = quantity;
        product.explored = 0;
        product.comments = [];
        product.orders = [];
        product.createdAt = new Date();
        product.updatedAt = new Date();
        product.deletedAt = false;
        product.image = null;

        return await this.productRepository.save(product);
    }

    async uploadImageForProductNoImage(id: number, file: Express.Multer.File): Promise<ProductEntity> {
        const product = await this.productRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['image'],
        });

        const { image } = product;
        if (image) {
            await this.imageService.deleteImage(image.id);
        }

        const newImage = await this.imageService.createImage(file, 'products');
        product.image = newImage;

        return await this.productRepository.save(product);
    }

    async createProduct({ name, price, description, quantity, image: file }: CreateProductDto): Promise<ProductEntity> {
        const product = new ProductEntity();
        product.name = name;
        product.description = description;
        product.price = price;
        product.quantity = quantity;
        product.rating = 0;
        product.explored = 0;
        product.comments = [];
        product.orders = [];
        product.createdAt = new Date();
        product.updatedAt = new Date();
        product.deletedAt = false;

        const image = await this.imageService.createImage(file, 'products');
        product.image = image;

        return await this.productRepository.save(product);
    }

    async updateProduct(
        id: number,
        { name, price, description, quantity, image }: UpdateProductDto,
    ): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['image'],
        });

        const {
            image: { id: imageId },
        } = product;

        const newImage: ImageEntity = await this.imageService.changeImage(imageId, image, 'products');

        product.name = name;
        product.description = description;
        product.price = price;
        product.quantity = quantity;
        product.image = newImage;
        product.updatedAt = new Date();

        return await this.productRepository.save(product);
    }

    async deleteProduct(id: number): Promise<any> {
        const product = await this.productRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['image'],
        });

        const { image } = product;
        if (image) {
            await this.imageService.deleteImage(image.id);
        }

        product.deletedAt = true;
        product.updatedAt = new Date();

        return await this.productRepository.save(product);
    }

    async calculateRating(id: number): Promise<any> {
        const product = await this.productRepository.findOne({
            where: { id, deletedAt: false },
            relations: ['comments'],
        });

        const { comments } = product;
        const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
        product.rating = sum / comments.length;

        return await this.productRepository.save(product);
    }

    async searchProductByName(name: string): Promise<any> {
        const products: ProductEntity[] = await this.productRepository
            .createQueryBuilder('product')
            .where('product.name LIKE :name', { name: `%${name}%` })
            .andWhere('product.deletedAt = :deletedAt', { deletedAt: false })
            .getMany();

        return products;
    }
}
