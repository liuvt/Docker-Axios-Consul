import { NestFactory } from '@nestjs/core';
import { ConfigService } from './config';
import { LogLevel, Logger } from '@nestjs/common';
import { WsAdapter } from './adapters/ws.adapter';
import { CrawlerModule } from './crawler/crawler.module';
import * as fs from 'fs';

const logger = new Logger('Bootstrap');
const configs = new ConfigService();

const PORT = configs.get('SERVICE_PORT');
const HTTP_URI = configs.get('SERVICE_HTTP_URI', false);
const LOG_LEVEL = configs.get('LOG_LEVEL', ['log', 'error', 'warn', 'debug', 'verbose'] as LogLevel[]);

const SSL_KEY_PATH = configs.get('SSL_KEY_PATH');
const SSL_CERT_PATH = configs.get('SSL_CERT_PATH');

async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH),
    };
    const app = await NestFactory.create(CrawlerModule, {httpsOptions, cors: true, logger: LOG_LEVEL});

    app.useWebSocketAdapter(new WsAdapter(app));

    app.enableShutdownHooks();

    app.enableCors();

    if (HTTP_URI) {
        app.setGlobalPrefix(HTTP_URI);
    }

    await app.listen(PORT);
}
bootstrap().then(() => logger.verbose(`Crawler server bootstrapped. [PORT: ${PORT}]`));
