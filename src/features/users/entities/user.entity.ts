import { IsEmail, Length, MinLength } from 'class-validator';
import { getConfig } from 'src/config';
import { GiftEntity } from 'src/features/gifts/entities/gift.entity';
import { HistoryEntity } from 'src/features/histories/entities/history.entity';
import { ImageEntity } from 'src/features/images/image.entity';
import { OrderEntity } from 'src/features/orders/entities/order.entity';
import { ShopEntity } from 'src/features/shops/entities/shop.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(10)
    username?: string;

    @Column()
    @IsEmail()
    email?: string;

    @Column()
    @MinLength(4)
    password?: string;

    @OneToOne(() => ImageEntity, (image) => image.id)
    @JoinColumn()
    image?: ImageEntity;

    @OneToMany(() => HistoryEntity, (history) => history.user)
    histories?: HistoryEntity[];

    @Column({ default: getConfig().ROLE.CUSTOMER })
    role?: string;

    @Column({ default: getConfig().TYPE_ACCOUNT.EMAIL })
    typeAccount?: string;

    @Column({ default: 0 })
    balance?: number;

    @Column({ default: 0 })
    exp?: number;

    @ManyToMany(() => ShopEntity)
    @JoinTable()
    favoriteShops?: ShopEntity[];

    @ManyToMany(() => GiftEntity)
    @JoinTable()
    gifts?: GiftEntity[];

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders?: OrderEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
