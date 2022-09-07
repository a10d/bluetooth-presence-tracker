import {btPresence as BTPresenceTracker} from "bt-presence";
import {ConfigService} from "./ConfigService.js";
import {Device} from "../../common/contracts/Device.js";
import {DeviceStatus} from "../../common/contracts/DeviceStatus.js";
import {PresenceStatus} from "../../common/contracts/PresenceStatus.js";
import {EventEmitter} from "events"
import {EventSubscriber} from "../../common/contracts/EventSubscriber.js";

interface TrackerOptions {
    pingCount: number;
    pingTimeout: number;
}

export enum TrackerEvent {
    DeviceConnected = 'device-connected',
    DeviceDisconnected = 'device-disconnected',
    DeviceUpdated = 'device-updated',
    DeviceAdded = 'device-added',
    DeviceRemoved = 'device-removed',
    StartedTracking = 'started-tracking',
    StoppedTracking = 'stopped-tracking',
}

export class TrackerService implements EventEmitter {

    tracked: DeviceStatus[];

    static defaultOptions: TrackerOptions = {
        pingCount: 3,
        pingTimeout: 5,
    }

    private options: TrackerOptions;

    private tracker: BTPresenceTracker;

    constructor(configService: ConfigService) {
        this.options = {
            ...TrackerService.defaultOptions,
            ...configService.config.tackingOptions,
        }

        this.tracked = [];

        this.tracker = new BTPresenceTracker();

        this.tracker.setPingOptions({
            count: this.options.pingCount,
            timeoutSecs: this.options.pingTimeout,
        })

        this.tracker.on(
            'present',
            (macAddress) => {
                this.setDeviceStatus({macAddress}, PresenceStatus.Present)
            }
        )

        this.tracker.on(
            'not-present',
            (macAddress) => {
                this.setDeviceStatus({macAddress}, PresenceStatus.Absent)
            }
        )
    }

    private eventSubscribers: EventSubscriber[] = [];

    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this.on(eventName, listener);
    }

    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        this.eventSubscribers.push({eventName, listener})
        return this;
    }

    once(eventName: string | symbol, listener: (...args: any[]) => void): this {
        this.eventSubscribers.push({eventName, listener, once: true})
        return this;
    }

    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this.off(eventName, listener);
    }

    off(eventName: string | symbol, listener: (...args: any[]) => void): this {
        if (this.eventSubscribers.indexOf({eventName, listener}) !== -1) {
            this.eventSubscribers.splice(this.eventSubscribers.indexOf({eventName, listener}), 1)
        }

        return this;
    }

    removeAllListeners(event?: string | symbol): this {
        if (event) {
            this.eventSubscribers = this.eventSubscribers.filter(({eventName}) => eventName !== event)
        } else {
            this.eventSubscribers = []
        }
        return this;
    }

    setMaxListeners(n: number): this {
        throw new Error("Method not implemented.");
    }

    getMaxListeners(): number {
        throw new Error("Method not implemented.");
    }

    listeners(eventName: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }

    rawListeners(eventName: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }

    emit(eventName: string | symbol, ...args: any[]): boolean {
        if (this.listenerCount(eventName) === 0) {
            return false;
        }

        for (const eventSubscriber of this.eventSubscribers.filter(l => l.eventName === eventName)) {
            eventSubscriber.listener(...args)

            if (eventSubscriber.hasOwnProperty('once') && eventSubscriber.once) {
                this.off(eventName, eventSubscriber.listener)
            }
        }

        return true;
    }

    listenerCount(eventName: string | symbol): number {
        return this.eventSubscribers.filter(l => l.eventName === eventName).length
    }

    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        this.eventSubscribers.unshift({eventName, listener})
        return this;
    }

    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        this.eventSubscribers.unshift({eventName, listener, once: true})
        return this;
    }

    eventNames(): (string | symbol)[] {
        return [
            TrackerEvent.DeviceConnected,
            TrackerEvent.DeviceDisconnected,
            TrackerEvent.DeviceUpdated,
            TrackerEvent.DeviceAdded,
            TrackerEvent.DeviceRemoved,
            TrackerEvent.StartedTracking,
            TrackerEvent.StoppedTracking,
        ]
    }

    startTracking() {
        try {
            this.tracker.start(true)
            this.emit(TrackerEvent.StartedTracking)
        } catch (e) {
            console.error('Could not start tracking', e)
        }
    }

    stopTracking() {
        this.tracker.stop()
        this.emit(TrackerEvent.StoppedTracking)
    }

    /**
     * Sets the presence status of a device
     * @param device {Device} The device to set the status for
     * @param status {PresenceStatus} The status to set
     * @private
     */
    private setDeviceStatus(device: Device, status: PresenceStatus) {

        if (!this.isTrackingDevice(device)) return;
        
        const trackedDeviceIndex = this.tracked
            .findIndex(ds => ds.device.macAddress.toLowerCase() === device.macAddress.toLowerCase());

        device = this.tracked[trackedDeviceIndex].device;
        this.tracked[trackedDeviceIndex].status = status;

        switch (status) {
            case PresenceStatus.Absent:
                this.emit(TrackerEvent.DeviceDisconnected, {device, status});
                break;

            case PresenceStatus.Present:
                this.emit(TrackerEvent.DeviceConnected, {device, status});
                break;
        }

        this.emit(TrackerEvent.DeviceUpdated, {device, status});
    }

    /**
     * Checks if a device is being tracked.
     * @param device {Device} The device to check
     */
    isTrackingDevice(device: Device): boolean {
        return !!this.tracked.find(ds => device.macAddress.toLowerCase() === ds.device.macAddress.toLowerCase())
    }

    /**
     * Overwrites the current list of tracked devices with a new list.
     * @param devices {Device[]} The devices to add
     */
    setDevices(devices: Device[]) {
        this.tracked = devices.map(device => ({
            device: {
                macAddress: device.macAddress.toLowerCase(),
                name: device.name,
            },
            status: PresenceStatus.Absent
        }))

        this.tracker.setDevices(devices.map(device => device.macAddress.toLowerCase()))
    }

    /**
     * Adds a device to the list of tracked devices.
     * @param device {Device} The device to add
     */
    addDevice(device: Device) {

        device.macAddress = device.macAddress.toLowerCase()

        if (!this.isTrackingDevice(device)) {

            this.tracked.push({
                device,
                status: PresenceStatus.Absent
            })

            this.tracker.addDevices([device.macAddress])

            this.emit(TrackerEvent.DeviceAdded, {
                device,
                status: PresenceStatus.Absent
            })
        } else {
            this.tracked[this.tracked.findIndex(ds => ds.device.macAddress === device.macAddress)].device.name = device.name
            this.emit(TrackerEvent.DeviceUpdated, {
                device
            })
        }

        return this;
    }

    /**
     * Removes a device from the list of tracked devices.
     * @param device {Device} The device to remove
     */
    removeDevice(device: Device) {
        device.macAddress = device.macAddress.toLowerCase()

        if (!this.isTrackingDevice(device)) {
            return;
        }

        this.tracked.splice(
            this.tracked.findIndex(ds => ds.device.macAddress === device.macAddress),
            1
        )

        this.tracker.removeDevices([device.macAddress])

        this.emit(TrackerEvent.DeviceRemoved, {device})
    }
}
