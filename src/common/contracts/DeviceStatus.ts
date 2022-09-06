import {Device} from "./Device";
import {PresenceStatus} from "./PresenceStatus";

export interface DeviceStatus {
    device: Device;
    status: PresenceStatus;
}
