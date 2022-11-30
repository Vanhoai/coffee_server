import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { TypeEntity } from '../missions/entities/type.entity';
import { TypeService } from '../missions/services/type.service';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductService } from '../products/services/product.service';
import { BalanceEntity } from '../users/entities/balance.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/services/users.service';
import { GiftController } from './controllers/gift.controller';
import { GiftEntity } from './entities/gift.entity';
import { GiftService } from './services/gift.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([GiftEntity, TypeEntity, UserEntity, BalanceEntity, ImageEntity, ProductEntity]),
    ],
    controllers: [GiftController],
    providers: [GiftService, TypeService, UserService, ImageService, ProductService, CloudinaryService],
    exports: [],
})
export class GiftModule {}
