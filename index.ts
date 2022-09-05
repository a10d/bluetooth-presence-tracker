// @ts-ignore
import express from 'express';
import {ConfigService} from "./services/ConfigService";

const config = ConfigService.loadConfig('config.json');

const app: express.Application = express();

interface Device {
    id: string;
    name: string;
    macAddress: string;
}


// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("TypeScript With Expresss");
});

// Server setup
app.listen(config.backendPort, () => {
    console.log(`TypeScript with Express
         http://localhost:${config.backendPort}/`);
});

console.log('OK')
