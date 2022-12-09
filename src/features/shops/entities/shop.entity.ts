import { ImageEntity } from 'src/features/images/image.entity';
import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopProductEntity } from './shop-product.entity';

@Entity({ name: 'shops' })
export class ShopEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    location?: string;

    @Column({ type: 'varchar', length: 2000 })
    description?: string;

    @OneToOne(() => ImageEntity, (image) => image.id)
    @JoinColumn()
    image?: ImageEntity;

    @Column({ type: 'float' })
    longitude?: number;

    @Column({ type: 'float' })
    latitude?: number;

    @OneToMany(() => ShopProductEntity, (shopProduct) => shopProduct.shop)
    products?: ShopProductEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
