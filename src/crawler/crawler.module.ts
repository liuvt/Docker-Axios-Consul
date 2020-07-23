import { CacheModule, HttpModule, Module, Logger } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { OgcController } from './ogc/ogc.controller';
import { OgcService } from './ogc/ogc.service';
import { ConfigModule, ConfigService } from '../config';
import { DiscoveryService } from '../discovery/discovery.service';
import { RoutingService } from '../discovery/routing.service';
import { DiscoveryModule } from '../discovery/discovery.module';
import { StickersController } from './stickers/stickers.controller';
import { StickersService } from './stickers/stickers.service';
import { TenorController } from './tenor/tenor.controller';
import { TenorService } from './tenor/tenor.service';

@Module({
    imports: [
        ConfigModule,
        DiscoveryModule,
        HttpModule,
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configs: ConfigService) => ({
                store: redisStore,
                url: configs.get('CRAWLER_CACHE_STORE'),
                ttl: configs.get('CRAWLER_CACHE_TTL', 3600 * 8),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [OgcController, StickersController, TenorController],
    providers: [OgcService, StickersService, TenorService],
})

export class CrawlerModule {
    private readonly logger = new Logger('CrawlerService');

    constructor(private readonly discovery: DiscoveryService, private readonly routing: RoutingService) {}

    async onApplicationBootstrap() {
        await this.routing.register();
        await this.discovery.register();
    }

    async beforeApplicationShutdown() {
        await this.discovery.deregister();
    }
}
