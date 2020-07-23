import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { DiscoveryService } from './discovery/discovery.service';
import { DiscoveryModule } from './discovery/discovery.module';
import { RoutingService } from './discovery/routing.service';
import { AppController } from './app.controller';
import { AppService } from "./app.service";

@Module({
    imports: [ConfigModule, DiscoveryModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
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
