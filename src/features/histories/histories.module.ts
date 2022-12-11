import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FCMService } from 'src/core/services/fcm.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GiftEntity } from '../gifts/entities/gift.entity';
import { GiftService } from '../gifts/services/gift.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { MissionUserEntity } from '../missions/entities/mission-user.entity';
import { MissionEntity } from '../missions/entities/mission.entity';
import { TypeEntity } from '../missions/entities/type.entity';
import { MissionService } from '../missions/services/mission.service';
import { TypeService } from '../missions/services/type.service';
import { OrderToProductEntity } from '../orders/entities/order-product.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderModule } from '../orders/order.module';
import { OrderService } from '../orders/services/order.service';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductService } from '../products/services/product.service';
import { ShopProductEntity } from '../shops/entities/shop-product.entity';
import { ShopEntity } from '../shops/entities/shop.entity';
import { ShopService } from '../shops/services/shop.service';
import { BalanceEntity } from '../users/entities/balance.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/services/users.service';
import { HistoryController } from './controllers/history.controller';
import { HistoryEntity } from './entities/history.entity';
import { HistoryService } from './services/history.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            HistoryEntity,
            UserEntity,
            OrderEntity,
            OrderToProductEntity,
            BalanceEntity,
            ProductEntity,
            ImageEntity,
            GiftEntity,
            TypeEntity,
            ShopEntity,
            ShopProductEntity,
            MissionEntity,
            MissionUserEntity,
        ]),
    ],
    controllers: [HistoryController],
    providers: [
        HistoryService,
        OrderService,
        UserService,
        ProductService,
        ImageService,
        CloudinaryService,
        GiftService,
        TypeService,
        ShopService,
        MissionService,
        FCMService,
    ],
    exports: [HistoryService],
})
export class HistoryModule {}
