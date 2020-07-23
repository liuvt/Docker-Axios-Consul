import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config';
import { LogLevel } from '@nestjs/common';
import { WsAdapter } from './adapters/ws.adapter';

const configs = new ConfigService();

const PORT = configs.get('SERVICE_PORT');
const HTTP_URI = configs.get('SERVICE_HTTP_URI', false);
const LOG_LEVEL = configs.get('LOG_LEVEL', ['log', 'error', 'warn', 'debug', 'verbose'] as LogLevel[]);

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: LOG_LEVEL,
    });

    app.useWebSocketAdapter(new WsAdapter(app));

    app.enableShutdownHooks();

    if (HTTP_URI) {
        app.setGlobalPrefix(HTTP_URI);
    }

    await app.listen(PORT);
}
bootstrap();
