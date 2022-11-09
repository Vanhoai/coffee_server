import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from './features/cloudinary/cloudinary.module';
import { GiftModule } from './features/gifts/gifts.module';
import { HistoryModule } from './features/histories/histories.module';
import { ImageModule } from './features/images/images.module';
import { MissionModule } from './features/missions/missions.module';
import { ProductModule } from './features/products/products.module';
import { ShopModule } from './features/shops/shops.module';
import { UserModule } from './features/users/users.module';
import { getConfig } from './config';
import { UserEntity } from './features/users/entities/user.entity';
import { ImageEntity } from './features/images/image.entity';
import { ShopEntity } from './features/shops/entities/shop.entity';
import { ProductEntity } from './features/products/entities/product.entity';
import { CommentModule } from './features/comments/comment.module';
import { CommentEntity } from './features/comments/comment.entity';
import { TypeEntity } from './features/missions/entities/type.entity';
import { GiftEntity } from './features/gifts/entities/gift.entity';
import { MissionEntity } from './features/missions/entities/mission.entity';
import { HistoryEntity } from './features/histories/entities/history.entity';
import { OrderEntity } from './features/orders/entities/order.entity';
import { OrderModule } from './features/orders/order.module';
import { OrderToProductEntity } from './features/orders/entities/order-product.entity';
import { PublicRoutes } from './features/public/public.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: getConfig().POSTGRES_HOST,
            port: getConfig().POSTGRES_PORT,
            username: getConfig().POSTGRES_USER,
            password: getConfig().POSTGRES_PASSWORD,
            database: getConfig().POSTGRES_DB,
            autoLoadEntities: true,
            synchronize: true,
            // entities: [__dirname + '/**/*.entity{.ts,.js}'],
            entities: [
                UserEntity,
                ImageEntity,
                ShopEntity,
                ProductEntity,
                CommentEntity,
                TypeEntity,
                GiftEntity,
                MissionEntity,
                HistoryEntity,
                OrderEntity,
                OrderToProductEntity,
            ],
        }),
        UserModule,
        ShopModule,
        ProductModule,
        GiftModule,
        MissionModule,
        ImageModule,
        HistoryModule,
        CloudinaryModule,
        CommentModule,
        OrderModule,
        PublicRoutes,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
