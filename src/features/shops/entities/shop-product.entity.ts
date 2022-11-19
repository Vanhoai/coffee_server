import { ProductEntity } from 'src/features/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopEntity } from './shop.entity';

@Entity('shop_product')
export class ShopProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => ShopEntity, (shop) => shop.products)
    shop: ShopEntity;

    @ManyToOne(() => ProductEntity, (product) => product.shops)
    product: ProductEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
