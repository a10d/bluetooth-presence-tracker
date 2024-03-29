import {defineStore} from "pinia";
import {connect as useSocket} from "socket.io-client";
import {Device} from "../../common/contracts/Device";
import {PresenceStatus} from "../../common/contracts/PresenceStatus";
import {DeviceStatus} from "../../common/contracts/DeviceStatus";

export const useBackend = defineStore('backend', {
    state: () => ({
        socket: null,
        connected: false,
        devicesStatus: [] as DeviceStatus[],
    }),
    actions: {
        connect() {
            this.socket = useSocket()

            this.socket.on('connect', () => this.onConnected())
            this.socket.on('disconnect', () => this.onDisconnected())

            this.socket.on('devices', (data) => this.devicesStatus = data)

            this.socket.on('device-added', ({device}) => this.onDeviceAdded(device))
            this.socket.on('device-updated', ({device, status}) => this.onDeviceUpdated(device, status))
            this.socket.on('device-removed', ({device}) => this.onDeviceRemoved(device))

            this.socket.on('device-connected', ({device}) => this.onDeviceUpdated(device, 1))
            this.socket.on('device-disconnected', ({device}) => this.onDeviceUpdated(device, 0))
        },

        onConnected() {
            this.connected = true
        },

        onDisconnected() {
            this.devicesStatus = []
            this.connected = false
        },

        onDeviceAdded(device: Device) {
            const indexOfDevice = this.devicesStatus.findIndex(deviceStatus => deviceStatus.device.macAddress === device.macAddress)
            if (indexOfDevice !== -1) {
                return this.onDeviceUpdated(device)
            }

            this.devicesStatus.push({
                device,
            })
        },

        onDeviceUpdated(device: Device, newStatus?: PresenceStatus) {
            const indexOfDevice = this.devicesStatus.findIndex(deviceStatus => deviceStatus.device.macAddress === device.macAddress)
            if (indexOfDevice !== -1) {
                const oldStatus = this.devicesStatus[indexOfDevice].status
                this.devicesStatus[indexOfDevice] = {
                    device,
                    status: (newStatus !== null ? newStatus : oldStatus),
                }
            }
        },

        onDeviceRemoved(device: Device) {
            const indexOfDevice = this.devicesStatus.findIndex(deviceStatus => deviceStatus.device.macAddress === device.macAddress)
            if (indexOfDevice !== -1) {
                this.devicesStatus.splice(indexOfDevice, 1)
            }
        },

        addDevice(device: Device) {
            this.socket.emit('add-device', device)
        },

        updateDevice(device: Device) {
            this.socket.emit('update-device', device)
        },

        removeDevice(device: Device) {
            this.socket.emit('remove-device', device)
        },

        startTracking() {
            this.socket.emit('start-tracking')
        },

        stopTracking() {
            this.socket.emit('stop-tracking')
        }
    }
})
