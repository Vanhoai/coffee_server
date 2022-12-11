import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FCMService } from 'src/core/services/fcm.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GiftEntity } from '../gifts/entities/gift.entity';
import { GiftService } from '../gifts/services/gift.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { OrderEntity } from '../orders/entities/order.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductService } from '../products/services/product.service';
import { BalanceEntity } from '../users/entities/balance.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/services/users.service';
import { MissionController } from './controllers/mission.controller';
import { TypeController } from './controllers/type.controller';
import { MissionUserEntity } from './entities/mission-user.entity';
import { MissionEntity } from './entities/mission.entity';
import { TypeEntity } from './entities/type.entity';
import { MissionService } from './services/mission.service';
import { TypeService } from './services/type.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MissionEntity,
            TypeEntity,
            OrderEntity,
            UserEntity,
            BalanceEntity,
            ImageEntity,
            ProductEntity,
            MissionUserEntity,
            GiftEntity,
        ]),
    ],
    controllers: [MissionController, TypeController],
    providers: [
        MissionService,
        TypeService,
        UserService,
        ImageService,
        ProductService,
        CloudinaryService,
        GiftService,
        FCMService,
    ],
    exports: [],
})
export class MissionModule {}
