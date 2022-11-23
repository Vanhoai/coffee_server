import { GiftEntity } from 'src/features/gifts/entities/gift.entity';
import { ShopEntity } from 'src/features/shops/entities/shop.entity';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

    @OneToOne(() => GiftEntity)
    @JoinColumn()
    gifts: GiftEntity;

    @OneToOne(() => ShopEntity)
    @JoinColumn()
    shops: ShopEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
