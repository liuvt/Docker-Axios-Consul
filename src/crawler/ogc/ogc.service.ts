import { Injectable, Logger } from '@nestjs/common';
import * as ogs from 'open-graph-scraper';
import * as Prerenderer from 'puppeteer-prerender';

import { isExistHttps } from './utils/check-exists-https';
import { extractUrlExtension } from './utils/extract-url-extention';
import { detailOgc, mediaOgc, resultCrawler } from './utils/format-data';
import { OgcResponseInterface } from '../../types/ogc/ogc-response.interface';

@Injectable()
export class OgcService {
    private readonly logger = new Logger(OgcService.name);

    async crawl(url: string): Promise<OgcResponseInterface> {
        this.logger.debug(`Crawling url ${url}`);
        const result = await this.scraper(url);
        return result !== null ? result : this.puppeteer(url);
    }

    private async puppeteer(url: string): Promise<OgcResponseInterface> {
        try {
            const prerender = new Prerenderer();
            const { openGraph } = await prerender.render(url, { followRedirect: true, timeout: 20000 });
            const result = await openGraph;
            if (!result) {
                return resultCrawler(url);
            }
            const { og } = result;
            const puppeteerCrawler = await detailOgc(og.site_name, og.title, og.description, url, og.type);
            const imageIndex = og.image[0];
            Object.assign(puppeteerCrawler, {
                image: mediaOgc(
                    imageIndex.url,
                    imageIndex.width,
                    imageIndex.height,
                    imageIndex.type || isExistHttps(imageIndex.url),
                ),
            });
            if (og.video) {
                const videoIndex = og.video[0];
                return Object.assign(puppeteerCrawler, {
                    video: mediaOgc(videoIndex.url, videoIndex.width, videoIndex.height, videoIndex.type),
                });
            }
            return puppeteerCrawler;
        } catch (e) {
            return resultCrawler(url);
        }
    }

    private async scraper(url: string): Promise<OgcResponseInterface> {
        try {
            const options = { url, timeout: 7000, allMedia: false, followAllRedirects: true };
            const data = await ogs(options);
            const { result } = data;
            const scraperCrawler = detailOgc(
                result.ogSiteName,
                result.ogTitle,
                result.ogDescription,
                result.ogUrl || isExistHttps(url),
                result.ogType,
            );
            const { ogImage } = result;
            Object.assign(scraperCrawler, {
                image: mediaOgc(
                    ogImage.url,
                    ogImage.width,
                    ogImage.height,
                    ogImage.type || extractUrlExtension(ogImage.url),
                ),
            });

            if (result.ogVideo) {
                const { ogVideo } = result;

                return Object.assign(scraperCrawler, {
                    video: mediaOgc(ogVideo.url, ogVideo.width, ogVideo.height, ogVideo.type),
                });
            }
            return scraperCrawler;
        } catch (e) {
            return null;
        }
    }
}
