import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GiftEntity } from '../gifts/entities/gift.entity';
import { GiftService } from '../gifts/services/gift.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { TypeEntity } from '../missions/entities/type.entity';
import { TypeService } from '../missions/services/type.service';
import { OrderToProductEntity } from '../orders/entities/order-product.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderService } from '../orders/services/order.service';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductService } from '../products/services/product.service';
import { ShopEntity } from '../shops/entities/shop.entity';
import { ShopService } from '../shops/services/shop.service';
import { BalanceEntity } from '../users/entities/balance.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/services/users.service';
import { CommentEntity } from './comment.entity';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CommentEntity,
            UserEntity,
            BalanceEntity,
            OrderEntity,
            OrderToProductEntity,
            ProductEntity,
            ImageEntity,
            GiftEntity,
            TypeEntity,
            ShopEntity,
        ]),
    ],
    controllers: [CommentController],
    providers: [
        CommentService,
        UserService,
        OrderService,
        ProductService,
        ImageService,
        CloudinaryService,
        GiftService,
        TypeService,
        ShopService,
    ],
    exports: [],
})
export class CommentModule {}
