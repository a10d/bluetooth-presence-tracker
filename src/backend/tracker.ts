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
        database.saveDevices(tracker.devices.map(ds => ds.device))
    }

    tracker.on(TrackerEvent.DeviceAdded, SaveDevicesToDatabase)
    tracker.on(TrackerEvent.DeviceRemoved, SaveDevicesToDatabase)
    tracker.on(TrackerEvent.DeviceUpdated, SaveDevicesToDatabase)
}

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
    socket.emit('devices', tracker.devices)
    socket.on('remove-device', (device) => tracker.removeDevice(device))
    socket.on('add-device', (device) => tracker.addDevice(device))
    socket.on('update-device', (device) => tracker.addDevice(device))
})

tracker.on(TrackerEvent.StartedTracking, (e) => io.local.emit(TrackerEvent.StartedTracking, e))
tracker.on(TrackerEvent.StoppedTracking, (e) => io.local.emit(TrackerEvent.StoppedTracking, e))
tracker.on(TrackerEvent.DeviceConnected, (e) => io.local.emit(TrackerEvent.DeviceConnected, e))
tracker.on(TrackerEvent.DeviceDisconnected, (e) => io.local.emit(TrackerEvent.DeviceDisconnected, e))
tracker.on(TrackerEvent.DeviceAdded, (e) => io.local.emit(TrackerEvent.DeviceAdded, e))
tracker.on(TrackerEvent.DeviceRemoved, (e) => io.local.emit(TrackerEvent.DeviceRemoved, e))
tracker.on(TrackerEvent.DeviceUpdated, (e) => io.local.emit(TrackerEvent.DeviceUpdated, e))

httpServer.listen(configService.config.backendPort, () => {
    console.log(`Listening on http://localhost:${configService.config.backendPort}/`);
});
