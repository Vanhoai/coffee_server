import { GiftEntity } from 'src/features/gifts/entities/gift.entity';
import { ShopEntity } from 'src/features/shops/entities/shop.entity';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderToProductEntity } from './order-product.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    user: UserEntity;

    @Column({ type: 'int' })
    status: number;

    @Column({ type: 'int' })
    shop: number;

    @Column({ type: 'float' })
    total: number;

    @Column({ type: 'varchar', length: 255 })
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
