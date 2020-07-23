import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '../../config';

@Injectable()
export class StickersService {
    private readonly ENDPOINT: string;

    private readonly API_KEY: string;

    constructor(private readonly config: ConfigService, private readonly http: HttpService) {
        this.ENDPOINT = this.config.get('CRAWLER_STICKER_ENDPOINT');
        this.API_KEY = this.config.get('CRAWLER_STICKER_TOKEN');
    }

    async getAll() {
        return this.http
            .get(this.ENDPOINT, {
                headers: { Authorization: `Bearer ${this.API_KEY}` },
            })
            .toPromise();
    }
}
