import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';

import { OgcService } from './ogc.service';
import { HttpCacheInterceptor } from '../../interceptors';
import { OgcResponseInterface } from '../../types/ogc/ogc-response.interface';

@Controller('ogc')
export class OgcController {
    constructor(private readonly crawler: OgcService) {}

    @UseInterceptors(HttpCacheInterceptor)
    @Get()
    async openGraphCrawler(@Query('url') url): Promise<OgcResponseInterface> {
        if (!url || url.length <= 0) {
            return {
                url: null,
            };
        }
        return this.crawler.crawl(url);
    }
}
