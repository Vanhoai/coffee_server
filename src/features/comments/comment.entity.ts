import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../products/entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user?: UserEntity;

    @ManyToOne(() => ProductEntity, (product) => product.comments)
    product?: ProductEntity;

    @Column()
    rating?: number;

    @Column()
    content?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column()
    deletedAt?: boolean;
}
