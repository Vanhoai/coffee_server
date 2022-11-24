import { getConfig } from 'src/config';
import { GiftEntity } from 'src/features/gifts/entities/gift.entity';
import { HistoryEntity } from 'src/features/histories/entities/history.entity';
import { ImageEntity } from 'src/features/images/image.entity';
import { MissionUserEntity } from 'src/features/missions/entities/mission-user.entity';
import { OrderEntity } from 'src/features/orders/entities/order.entity';
import { ProductEntity } from 'src/features/products/entities/product.entity';
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
import { BalanceEntity } from './balance.entity';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    username?: string;

    @Column({ type: 'varchar', length: 255 })
    email?: string;

    @Column({ type: 'varchar', length: 255 })
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

    @OneToOne(() => BalanceEntity, (balance) => balance.id)
    @JoinColumn()
    balance?: BalanceEntity;

    @Column({ default: 0, type: 'float' })
    exp?: number;

    @ManyToMany(() => ShopEntity)
    @JoinTable()
    favoriteShops?: ShopEntity[];

    @ManyToMany(() => ProductEntity)
    @JoinTable()
    favoriteProducts?: ProductEntity[];

    @OneToMany(() => MissionUserEntity, (missionUser) => missionUser.user)
    missionUsers?: MissionUserEntity[];

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
