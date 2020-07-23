import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONSUL_CLIENT_SERVICE } from './discovery.contants';
import { ConfigService } from '../config';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

@Injectable()
export class DiscoveryService {
    private readonly logger = new Logger(DiscoveryService.name);

    private readonly NAME: string;

    private readonly ID: string;

    private readonly ADDRESS: string;

    private readonly PORT: number;

    private readonly TAGS: string[];

    constructor(@Inject(CONSUL_CLIENT_SERVICE) private readonly consul, private readonly configs: ConfigService) {
        this.NAME = this.configs.get('SERVICE_NAME');
        this.ID = this.configs.get('SERVICE_NAME') + `_${process.pid}`;
        this.ADDRESS = this.configs.get('SERVICE_ADDRESS');
        this.PORT = parseInt(this.configs.get('SERVICE_PORT'));
        this.TAGS = this.configs.get('SERVICE_TAGS', ['crawler']);
    }

    register() {
        return new Promise((resolve, reject) => {
            this.consul.agent.service.register(
                {
                    name: this.NAME,
                    id: this.ID,
                    tags: this.TAGS,
                    address: this.ADDRESS,
                    port: this.PORT,
                    check: {
                        tcp: `${this.ADDRESS}:${this.PORT}`,
                        interval: '5s',
                    },
                },
                (err) => {
                    if (err) {
                        throw new RuntimeException(`Could not register ${this.NAME} service.`);
                    }

                    this.logger.debug(`${this.NAME} service registered with Consul.`);

                    resolve();
                },
            );
        });
    }

    async deregister() {
        return new Promise((resolve, reject) => {
            this.consul.agent.service.deregister(this.ID, (err) => {
                if (err) {
                    this.logger.error(err);
                }

                this.logger.debug(`${this.NAME} service deregistered with Consul.`);
                resolve();
            });
        });
    }
}
