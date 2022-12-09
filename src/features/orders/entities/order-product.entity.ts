import { ProductEntity } from 'src/features/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_products' })
export class OrderToProductEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ManyToOne(() => OrderEntity, (order) => order.products)
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, (product) => product.orders)
    product: ProductEntity;

    @Column({ type: 'float' })
    price: number;

    @Column({ type: 'float' })
    total: number;

    @Column({ type: 'int' })
    count: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
