import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config';
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly configs: ConfigService, private readonly appService: AppService) {}

    @Get()
    index() {
        return {
            name: this.configs.get('SERVICE_NAME'),
            version: this.configs.get('SERVICE_VERSION'),
            uri: this.configs.get('SERVICE_HTTP_URI'),
        };
    }

    @Get("a")
    async methodA() {
        return this.appService.methodA();
    }
}
