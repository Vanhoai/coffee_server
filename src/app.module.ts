import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './config';
import { AppLoggerMiddleware } from './core/middlewares/logger.middleware';
import { CloudinaryModule } from './features/cloudinary/cloudinary.module';
import { CommentModule } from './features/comments/comment.module';
import { GiftModule } from './features/gifts/gifts.module';
import { HistoryModule } from './features/histories/histories.module';
import { ImageModule } from './features/images/images.module';
import { MissionModule } from './features/missions/missions.module';
import { OrderModule } from './features/orders/order.module';
import { ProductModule } from './features/products/products.module';
import { PublicRoutes } from './features/public/public.module';
import { ShopModule } from './features/shops/shops.module';
import { UserModule } from './features/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import admin, { ServiceAccount } from 'firebase-admin';
import credentials from '../google-services.json';

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
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
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
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: getConfig().HOST_EMAIL,
                    port: 587,
                    secure: false,
                    pool: true,
                    auth: {
                        user: getConfig().USER_EMAIL,
                        pass: getConfig().PASSWORD_EMAIL,
                    },
                },
                defaults: {
                    from: '"nest-modules" <modules@nestjs.com>',
                },
                template: {
                    dir: process.cwd() + '/templates/',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
        FirebaseAdminModule.forRootAsync({
            useFactory: () => ({
                credential: admin.credential.cert(credentials as ServiceAccount),
            }),
        }),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
