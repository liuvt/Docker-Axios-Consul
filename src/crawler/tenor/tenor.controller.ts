import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';

import { TenorService } from './tenor.service';
import { HttpCacheInterceptor } from '../../interceptors';

@Controller('gif')
@UseInterceptors(HttpCacheInterceptor)
export class TenorController {
    constructor(private readonly service: TenorService) {}

    @Get()
    async index() {
        const {
            data: { results: trending },
        } = await this.service.trending('20');
        const {
            data: { tags },
        } = await this.service.categories('featured');

        const featured = await Promise.all(
            tags.map(async (tag: { searchterm: string; image: string }) => {
                const {
                    data: { results },
                } = await this.service.search(tag.searchterm, '20');
                return {
                    ...tag,
                    results,
                };
            }),
        );

        return {
            trending,
            featured,
        };
    }

    @Get('tags')
    async tags() {
        const results = await this.service.categories();

        return results.data;
    }

    @Get('search')
    async search(@Query('q') q, @Query('limit') limit = 20) {
        const results = await this.service.search(q, limit.toString());

        return results.data;
    }

    @Get('trending')
    async trending(@Query('limit') limit = 20) {
        const results = await this.service.trending(limit.toString());

        return results.data;
    }
}
