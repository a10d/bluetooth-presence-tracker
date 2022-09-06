import {readFileSync} from "fs";

export interface Config {
    backendPort?: number;

    debug?: boolean;

    trackingEnabled?: boolean;

    tackingOptions?: {
        pingCount?: number,
        pingTimeout?: number,
    },

    storeDevices?: boolean;

    databaseOptions?: {
        url?: string;
        username?: string;
        password?: string;
        name?: string;
        database?: number;
    }
}

export class ConfigService {
    static defaultConfig: Config = {
        backendPort: 3000,
        debug: false,

        trackingEnabled: true,
        storeDevices: true,

        tackingOptions: {
            pingCount: 5,
            pingTimeout: 10,
        },
    }

    config: Config;

    private constructor(config: Config) {
        this.config = config
    }

    static loadConfig(filename: string): ConfigService {
        try {
            const configFile = readFileSync(filename);

            const loadedConfig = JSON.parse(configFile.toString('utf-8'))
            return new ConfigService({
                ...ConfigService.defaultConfig,
                ...loadedConfig,
            })
        } catch (e) {
            console.warn('Could not read config file, defaulting to standard config...')
            return new ConfigService(ConfigService.defaultConfig);
        }
    }
}
