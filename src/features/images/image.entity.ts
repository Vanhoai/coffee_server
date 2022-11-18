import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'images' })
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url?: string;

    @Column()
    publicId?: string;

    @Column()
    width?: number;

    @Column()
    height?: number;

    @Column()
    format?: string;

    @Column()
    signature?: string;

    @Column()
    secureUrl?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
