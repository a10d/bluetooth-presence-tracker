import {createServer} from "http";
import {Server} from "socket.io";
import {ConfigService} from "./services/ConfigService.js";
import {TrackerEvent, TrackerService} from "./services/TrackerService.js";
import {DatabaseService} from "./services/DatabaseService.js";

const configService = ConfigService.loadConfig('config.json');

const tracker = new TrackerService(configService)
const database = new DatabaseService(configService)

/**
 * Persist the devices on disk
 */
if (configService.config.storeDevices) {
    database.connect()
        .then(() => database.loadDevices().then(devices => tracker.setDevices(devices)))

    const SaveDevicesToDatabase = () => {
        if (configService.config.debug) console.log('Saving devices to database...')
        database.saveDevices(tracker.devices.map(ds => ds.device)).then(() => console.log('[Changes saved]'))
    }

    tracker.on(TrackerEvent.DeviceAdded, SaveDevicesToDatabase)
    tracker.on(TrackerEvent.DeviceRemoved, SaveDevicesToDatabase)
    tracker.on(TrackerEvent.DeviceUpdated, SaveDevicesToDatabase)
}

/**
 * Enable tracking
 */
if (configService.config.trackingEnabled) {
    try {
        tracker.startTracking()
    } catch (e) {
        console.error('Could not start tracking...')
    }
}

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('Connection over socket.io (default)')
})


io.on('remove-device', (data) => {
    console.log('remove-device', data)
})

io.on('add-device', (data) => {
    console.log('add-device', data)
})

tracker.on(TrackerEvent.StartedTracking, () => io.send({event: TrackerEvent.StartedTracking,}))
tracker.on(TrackerEvent.StoppedTracking, () => io.send({event: TrackerEvent.StoppedTracking,}))
tracker.on(TrackerEvent.DeviceConnected, ({device}) => io.send({event: TrackerEvent.DeviceConnected, device,}))
tracker.on(TrackerEvent.DeviceDisconnected, ({device}) => io.send({event: TrackerEvent.DeviceDisconnected, device,}))

/**
 // Handling '/' Request
 app.get('/', (_req, _res) => {
    _res.send("TypeScript With Expresss");
});

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


 **/

httpServer.listen(configService.config.backendPort, () => {
    console.log(`Listening on http://localhost:${configService.config.backendPort}/`);
});
