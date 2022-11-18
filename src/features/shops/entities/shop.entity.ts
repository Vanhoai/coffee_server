import { ImageEntity } from 'src/features/images/image.entity';
import { ProductEntity } from 'src/features/products/entities/product.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

    @ManyToMany(() => ProductEntity)
    @JoinTable()
    products?: ProductEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
