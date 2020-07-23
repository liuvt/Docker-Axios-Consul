import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { StickersService } from './stickers.service';
import { HttpCacheInterceptor } from '../../interceptors';

@Controller('stickers')
@UseInterceptors(HttpCacheInterceptor)
export class StickersController {
    constructor(private readonly service: StickersService) {}

    @Get()
    async index() {
        const { data } = await this.service.getAll();

        return {
            collections: data.docs,
        };
    }
}
