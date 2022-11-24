import { CommentEntity } from 'src/features/comments/comment.entity';
import { ImageEntity } from 'src/features/images/image.entity';
import { OrderToProductEntity } from 'src/features/orders/entities/order-product.entity';
import { ShopProductEntity } from 'src/features/shops/entities/shop-product.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name?: string;

    @Column({ type: 'varchar', length: 255 })
    description?: string;

    @OneToOne(() => ImageEntity, (image) => image.id)
    @JoinColumn()
    image?: ImageEntity;

    @Column({ type: 'float' })
    price?: number;

    @Column({ type: 'int' })
    explored?: number;

    @Column({ type: 'float' })
    rating?: number;

    @Column({ type: 'int' })
    quantity?: number;

    @OneToMany(() => CommentEntity, (comment) => comment.product)
    comments?: CommentEntity[];

    @OneToMany(() => OrderToProductEntity, (orderToProduct) => orderToProduct.product)
    orders?: OrderToProductEntity[];

    @OneToMany(() => ShopProductEntity, (shopProduct) => shopProduct.product)
    shops?: ShopProductEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
