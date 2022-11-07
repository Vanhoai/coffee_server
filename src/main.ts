import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from './config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(getConfig().API);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: getConfig().COR_ORIGIN,
    });
    await app.listen(getConfig().PORT);
}
bootstrap();
