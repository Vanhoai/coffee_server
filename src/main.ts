import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from './config';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule);
    app.setGlobalPrefix(getConfig().API);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: getConfig().COR_ORIGIN,
        credentials: true,
    });
    await app.listen(getConfig().PORT);
}
bootstrap();
