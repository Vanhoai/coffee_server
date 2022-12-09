import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'images' })
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    url?: string;

    @Column({ type: 'varchar', length: 255 })
    publicId?: string;

    @Column({ type: 'float' })
    width?: number;

    @Column({ type: 'float' })
    height?: number;

    @Column({ type: 'varchar', length: 255 })
    format?: string;

    @Column({ type: 'varchar', length: 255 })
    signature?: string;

    @Column({ type: 'varchar', length: 255 })
    secureUrl?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
