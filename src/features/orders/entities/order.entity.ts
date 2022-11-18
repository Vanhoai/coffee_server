import { UserEntity } from 'src/features/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderToProductEntity } from './order-product.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    user: UserEntity;

    @Column()
    status: number;

    @Column()
    total: number;

    @Column()
    address: string;

    @OneToMany(() => OrderToProductEntity, (orderToProduct) => orderToProduct.order)
    products: OrderToProductEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
