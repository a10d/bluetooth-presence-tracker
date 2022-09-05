import {readFileSync} from "fs";

export interface Config {
    backendPort?: number;
    debug?: boolean;
}

export class ConfigService {
    static defaultConfig: Config = {
        backendPort: 3000,
        debug: false,
    }

    static loadConfig(filename: string): Config {
        try {
            const configFile = readFileSync(filename);

            const loadedConfig = JSON.parse(configFile.toString('utf-8'))

            return {
                ...ConfigService.defaultConfig,
                ...loadedConfig,
            }
        } catch (e) {
            return ConfigService.defaultConfig;
        }
    }
}
