import { HttpModule, Module } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { CONSUL_CLIENT_SERVICE } from './discovery.contants';
import * as Consul from 'consul';
import { ConfigModule, ConfigService } from '../config';
import { RoutingService } from './routing.service';

@Module({
    imports: [ConfigModule, HttpModule],
    providers: [
        {
            useFactory: (configs: ConfigService) => {
                return Consul({
                    host: configs.get('CONSUL_HOST'),
                    port: configs.get('CONSUL_PORT'),
                });
            },
            provide: CONSUL_CLIENT_SERVICE,
            inject: [ConfigService],
        },
        DiscoveryService,
        RoutingService,
    ],
    exports: [DiscoveryService, RoutingService],
})
export class DiscoveryModule {}
