import { Device } from "./Device.js";
import { PresenceStatus } from "./PresenceStatus.js";

export interface DeviceStatus {
    device: Device;
    status: PresenceStatus;
}
