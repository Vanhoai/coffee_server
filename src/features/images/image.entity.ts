import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'images' })
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url?: string;
}
