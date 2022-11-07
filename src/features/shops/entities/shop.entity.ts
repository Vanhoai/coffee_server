import { ImageEntity } from 'src/features/images/image.entity';
import { ProductEntity } from 'src/features/products/entities/product.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'shops' })
export class ShopEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    location?: string;

    @Column()
    description?: string;

    @OneToOne(() => ImageEntity, (image) => image.id)
    image?: ImageEntity;

    @ManyToMany(() => ProductEntity)
    @JoinTable()
    products?: ProductEntity[];
}
