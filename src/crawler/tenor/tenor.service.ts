import { HttpService, Injectable, Logger } from '@nestjs/common';
import { stringify } from 'querystring';
import { ConfigService } from '../../config';

@Injectable()
export class TenorService {
    private readonly API_KEY: string;

    private readonly API_BASE: string;

    private readonly LOCALE: string;

    private readonly logger = new Logger(TenorService.name);

    constructor(private readonly config: ConfigService, private readonly http: HttpService) {
        this.API_KEY = this.config.get('CRAWLER_TENOR_TOKEN');
        this.API_BASE = this.config.get('CRAWLER_TENOR_BASE_URL', 'https://api.tenor.com/v1');
        this.LOCALE = this.config.get('CRAWLER_TENOR_LOCALE', 'vi_VN');
    }

    private getEndpoint(path: string, params: { [key: string]: string }) {
        const query = stringify({
            ...params,
            key: this.API_KEY,
            locale: this.LOCALE,
            // eslint-disable-next-line @typescript-eslint/camelcase
            media_filter: 'minimal',
        });

        return `${this.API_BASE}/${path}?${query}`;
    }

    async categories(type = 'featured') {
        const endpoint = this.getEndpoint('categories', { type });
        this.logger.verbose(`Searching GIFs [ENDPOINT - ${endpoint}]`);

        return this.http.get(endpoint).toPromise();
    }

    async search(q: string, limit: string) {
        const endpoint = this.getEndpoint('search', { q, limit });
        this.logger.verbose(`Searching GIFs [ENDPOINT - ${endpoint}]`);

        return this.http.get(endpoint).toPromise();
    }

    async trending(limit: string) {
        const endpoint = this.getEndpoint('trending', { limit });

        this.logger.verbose(`Get trending GIFs [ENDPOINT - ${endpoint}]`);

        return this.http.get(endpoint).toPromise();
    }
}
