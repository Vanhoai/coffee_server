import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopEntity } from '../shops/entities/shop.entity';

@Entity({ name: 'images' })
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url?: string;

    @Column()
    publicId?: string;
}
