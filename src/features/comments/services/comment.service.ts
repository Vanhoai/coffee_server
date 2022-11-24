import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from 'src/features/orders/services/order.service';
import { ProductService } from 'src/features/products/services/product.service';
import { UserService } from 'src/features/users/services/users.service';
import { Repository } from 'typeorm';
import { CommentEntity } from '../comment.entity';
import { CreateCommentDto } from '../dto/CreateComment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        private readonly userService: UserService,
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
    ) {}

    async getAllComments(): Promise<CommentEntity[]> {
        return await this.commentRepository.find({
            relations: ['user', 'product'],
        });
    }

    async getCommentById(id: number): Promise<CommentEntity> {
        return await this.commentRepository.findOne({
            where: { id },
            relations: ['user', 'product'],
        });
    }

    async createComment({ userId, productId, content, rating }: CreateCommentDto): Promise<any> {
        const user = await this.userService.getUserById(userId);
        const product = await this.productService.findProductById(productId);

        if (!user) {
            throw new Error('User not found');
        }

        if (!product) {
            throw new Error('Product not found');
        }

        const comment = new CommentEntity();
        comment.user = user;
        comment.product = product;
        comment.content = content;
        comment.rating = rating;
        comment.createdAt = new Date();
        comment.updatedAt = new Date();
        comment.deletedAt = false;

        product.comments.push(comment);
        await this.productService.calculateRating(productId);

        await this.commentRepository.save(comment);

        return {};
    }

    async updateComment(id: number, content: string): Promise<CommentEntity> {
        return null;
    }

    async deleteComment(id: number): Promise<CommentEntity> {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!comment) {
            throw new Error('Comment not found');
        }

        comment.deletedAt = true;
        comment.updatedAt = new Date();

        return await this.commentRepository.save(comment);
    }

    async restoreComment(id: number): Promise<CommentEntity> {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!comment) {
            throw new Error('Comment not found');
        }

        comment.deletedAt = false;
        comment.updatedAt = new Date();

        return await this.commentRepository.save(comment);
    }

    async removeComment(id: number): Promise<CommentEntity> {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!comment) {
            throw new Error('Comment not found');
        }

        return await this.commentRepository.remove(comment);
    }
}
