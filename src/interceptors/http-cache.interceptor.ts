import { CacheInterceptor, ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
    private readonly logger = new Logger(HttpCacheInterceptor.name);

    /**
     * Encode cache key if needed
     * @param context
     */
    trackBy(context: ExecutionContext): string | undefined {
        // const key = super.trackBy(context);
        // return Buffer.from(key).toString('base64');
        const key = super.trackBy(context);

        this.logger.debug(`Fetching from cache [KEY: "${key}"]`);

        return key;
    }
}
