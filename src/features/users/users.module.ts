import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/core/middlewares/auth.middeware';
import { RoleMiddleware } from 'src/core/middlewares/role.middleware';
import { TokenService } from 'src/core/services/token.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageEntity } from '../images/image.entity';
import { ImageService } from '../images/image.service';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductService } from '../products/services/product.service';
import { AuthController } from './controllers/auth/auths.controller';
import { UserController } from './controllers/user/users.controller';
import { BalanceEntity } from './entities/balance.entity';
import { UserEntity } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserService } from './services/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, ImageEntity, BalanceEntity, ProductEntity])],
    controllers: [AuthController, UserController],
    providers: [AuthService, UserService, JwtService, TokenService, ImageService, CloudinaryService, ProductService],
    exports: [],
})
export class UserModule {}
