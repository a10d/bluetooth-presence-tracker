import { createClient, RedisClientType } from "redis";
import { ConfigService } from "./ConfigService.js";

interface DatabaseOptions {
    url?: string;
    username?: string;
    password?: string;
    name?: string;
    database?: number;
}

interface DeviceModel {
    macAddress: string;
    name?: string;
}

export class DatabaseService {

    private client: RedisClientType;

    static defaultOptions: DatabaseOptions = {
        url: "redis://localhost:6379",
        database: 0,
    };

    constructor(configService: ConfigService) {
        this.client = createClient({
            ...DatabaseService.defaultOptions,
            ...configService.config.databaseOptions,
        });
    }

    async connect() {
        await this.client.connect();
        return this;
    }

    async loadDevices(): Promise<DeviceModel[]> {
        try {
            const data = await this.client.get("devices");
            if ( data ) return JSON.parse(data);
        } catch (e) {
            console.error("Could not fetch devices");
        }

        return [];
    }

    async saveDevices(devices: DeviceModel[]) {

        await this.client.set("devices", JSON.stringify(devices));

        return this;
    }
}
