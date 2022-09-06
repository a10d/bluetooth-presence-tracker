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
            this.socket.on('device-updated', ({device}) => this.onDeviceUpdated(device))
            this.socket.on('device-removed', ({device}) => this.onDeviceRemoved(device))
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

        onDeviceUpdated(device: Device, status?: PresenceStatus) {
            const indexOfDevice = this.devicesStatus.findIndex(deviceStatus => deviceStatus.device.macAddress === device.macAddress)
            if (indexOfDevice !== -1) {
                this.devicesStatus[indexOfDevice].device.name = device.name
                if (status) {
                    this.devicesStatus[indexOfDevice].status = status
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
