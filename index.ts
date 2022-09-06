// @ts-ignore
import express from 'express';
import {Server as SocketIoServer} from 'socket.io'
import {createServer} from "http";
import {ConfigService} from "./services/ConfigService";
import {TrackerEvent, TrackerService} from "./services/TrackerService";
import {DatabaseService} from "./services/DatabaseService";
import {PresenceStatus} from './contracts/PresenceStatus'
import {Device} from "./contracts/Device";

const configService = ConfigService.loadConfig('config.json');

const tracker = new TrackerService(configService)
const database = new DatabaseService(configService)

database.connect()
    .then(() => {
        database.loadDevices().then(devices => tracker.setDevices(devices))
    })

try {
    // tracker.startTracking()
} catch (e) {
    console.error('Could not start tracking...')
}


const app: express.Application = express();
app.use(express.json())

const server = createServer(app)

const io = new SocketIoServer(server, {
    cors: {
        origin: '*'
    }
});

io.of('api/live').on('connection', (socket) => {
    console.log('Connection over socket.io of api/live', socket)
})

io.on('connection', (socket) => {
    console.log('Connection over socket.io (default)', socket)
})

const SaveDevicesToDatabase = () => {
    if (configService.config.debug) console.log('Saving devices to database...')
    database.saveDevices(tracker.devices.map(ds => ds.device)).then(() => console.log('[Changes saved]'))
}

tracker.on(TrackerEvent.DeviceAdded, SaveDevicesToDatabase)
tracker.on(TrackerEvent.DeviceRemoved, SaveDevicesToDatabase)
tracker.on(TrackerEvent.DeviceUpdated, SaveDevicesToDatabase)

tracker.on(TrackerEvent.StartedTracking, () => io.send({event: TrackerEvent.StartedTracking,}))
tracker.on(TrackerEvent.StoppedTracking, () => io.send({event: TrackerEvent.StoppedTracking,}))
tracker.on(TrackerEvent.DeviceConnected, ({device}) => io.send({event: TrackerEvent.DeviceConnected, device,}))
tracker.on(TrackerEvent.DeviceDisconnected, ({device}) => io.send({event: TrackerEvent.DeviceDisconnected, device,}))

// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("TypeScript With Expresss");
});


app.get('/api/devices/present', (_req, _res) => {
    return tracker.devices
        .filter(ds => PresenceStatus.Present === ds.status)
        .map(ds => ds.device.name ?? 'Unknown Device')
})

app.post('/api/devices', (_req, _res) => {
    if (_req.body.hasOwnProperty('macAddress') && _req.body.hasOwnProperty('name')) {
        const device: Device = {
            macAddress: _req.body.macAddress,
            name: _req.body.name,
        }
        tracker.addDevice(device)
        return _res.status(201)
    }

    return _res.status(400).json({
        error: 'Validation failed'
    })

})

app.delete('/api/devices', (_req, _res) => {
    if (_req.body.hasOwnProperty('macAddress')) {
        const device: Device = {
            macAddress: _req.body.macAddress,
        }
        tracker.removeDevice(device)
        return _res.status(200)
    }
    return _res.status(401)
})

// Server setup
server.listen(configService.config.backendPort, () => {
    console.log(`Listening on http://localhost:${configService.config.backendPort}/`);
});
