import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config';

@Injectable()
export class RoutingService {
    private readonly logger = new Logger(RoutingService.name);

    NAME: string;

    GATEWAY_ROUTES_ENDPOINT: string;

    GATEWAY_ADMIN_KEY: string;

    WS_URI: string | boolean;

    HTTP_URI: string | boolean;

    constructor(private readonly configs: ConfigService, private readonly http: HttpService) {
        this.NAME = this.configs.get('SERVICE_NAME');
        this.GATEWAY_ROUTES_ENDPOINT = this.configs.get('GATEWAY_ROUTES_ENDPOINT');
        this.GATEWAY_ADMIN_KEY = this.configs.get('GATEWAY_ADMIN_KEY');

        this.WS_URI = this.configs.get('SERVICE_WS_URI', false);
        this.HTTP_URI = this.configs.get('SERVICE_HTTP_URI', false);
    }

    async register(priority = 0, plugins = {}) {
        if (this.WS_URI) {
            await this._register(this.WS_URI, true, priority, plugins);
        }

        if (this.HTTP_URI) {
            await this._register(this.HTTP_URI, false, priority, plugins);
        }
    }

    private async _register(uri, enable_websocket = false, priority = 0, plugins = {}) {
        try {
            const url = enable_websocket ? `${this.GATEWAY_ROUTES_ENDPOINT}010` : this.GATEWAY_ROUTES_ENDPOINT;
            const data = {
                uri,
                priority,
                plugins,
                upstream: {
                    service_name: this.NAME,
                    type: 'roundrobin',
                    enable_websocket,
                },
            };

            this.logger.verbose(`Registering API route [URL: ${url}, DATA: ${JSON.stringify(data)}]`);

            this.logger.debug(`${this.NAME} route registered with API Gateway. [URI: ${uri}]`);

            return this.http
                .put(url, data, {
                    headers: { 'X-API-KEY': this.GATEWAY_ADMIN_KEY },
                })
                .toPromise();
        } catch (e) {
            this.logger.error(e);
        }
    }
}
