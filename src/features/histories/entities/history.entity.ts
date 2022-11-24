import { ImageEntity } from 'src/features/images/image.entity';
import { OrderEntity } from 'src/features/orders/entities/order.entity';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'histories' })
export class HistoryEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @OneToOne(() => ImageEntity, (image) => image.id)
    image?: ImageEntity;

    @ManyToOne(() => UserEntity, (user) => user.histories)
    user: UserEntity;

    @OneToOne(() => OrderEntity)
    order?: OrderEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
