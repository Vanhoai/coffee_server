import { CommentEntity } from 'src/features/comments/comment.entity';
import { ImageEntity } from 'src/features/images/image.entity';
import { OrderToProductEntity } from 'src/features/orders/entities/order-product.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name?: string;

    @OneToOne(() => ImageEntity, (image) => image.id)
    image?: ImageEntity;

    @Column()
    price?: number;

    @Column()
    explored?: number;

    @Column()
    quantity?: number;

    @OneToMany(() => CommentEntity, (comment) => comment.product)
    comments?: CommentEntity[];

    @OneToMany(() => OrderToProductEntity, (orderToProduct) => orderToProduct.product)
    orders?: OrderToProductEntity[];
}
