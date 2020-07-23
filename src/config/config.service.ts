import { Logger } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import * as fs from 'fs';
import * as nconf from 'nconf';
import { resolve } from 'path';

export class ConfigService {
    private readonly envConfig: { [key: string]: any };

    private readonly logger = new Logger(ConfigService.name);

    constructor() {
        const ENV = process.env.NODE_ENV || 'development';
        const configFile = `env.${ENV}.json`;
        const configPath = resolve(process.cwd(), configFile);

        if (!fs.existsSync(configPath)) {
            this.logger.warn(`Missing ${configFile} file.`);
        }

        nconf.file({ file: configPath }).argv().env();
    }

    /**
     * Return common value
     * @param {string} key
     * @param {T} defaultValue
     */
    get<T = any>(key: string, defaultValue: T = null): T {
        const result = nconf.get(key) || defaultValue;

        if (result === undefined) {
            throw new RuntimeException(`Key ${key} not found.`);
        }

        return result;
    }
}
