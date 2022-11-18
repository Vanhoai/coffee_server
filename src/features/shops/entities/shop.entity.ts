import { ImageEntity } from 'src/features/images/image.entity';
import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopProductEntity } from './shop-product.entity';

@Entity({ name: 'shops' })
export class ShopEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    location?: string;

    @Column()
    description?: string;

    @OneToOne(() => ImageEntity, (image) => image.id)
    @JoinColumn()
    image?: ImageEntity;

    @Column()
    longitude?: number;

    @Column()
    latitude?: number;

    @OneToMany(() => ShopProductEntity, (shopProduct) => shopProduct.shop)
    @JoinColumn()
    products?: ShopProductEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
