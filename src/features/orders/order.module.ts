import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GiftEntity } from '../gifts/entities/gift.entity';
import { GiftService } from '../gifts/services/gift.service';
import { HistoryEntity } from '../histories/entities/history.entity';
import { HistoryService } from '../histories/services/history.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { TypeEntity } from '../missions/entities/type.entity';
import { TypeService } from '../missions/services/type.service';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductService } from '../products/services/product.service';
import { ShopProductEntity } from '../shops/entities/shop-product.entity';
import { ShopEntity } from '../shops/entities/shop.entity';
import { ShopService } from '../shops/services/shop.service';
import { BalanceEntity } from '../users/entities/balance.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/services/users.service';
import { OrderController } from './controllers/order.controller';
import { OrderToProductEntity } from './entities/order-product.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './services/order.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            OrderToProductEntity,
            ProductEntity,
            ImageEntity,
            UserEntity,
            BalanceEntity,
            GiftEntity,
            TypeEntity,
            ShopEntity,
            HistoryEntity,
            ShopProductEntity,
        ]),
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        ShopService,
        ProductService,
        UserService,
        ImageService,
        CloudinaryService,
        GiftService,
        TypeService,
        HistoryService,
    ],
    exports: [],
})
export class OrderModule {}
