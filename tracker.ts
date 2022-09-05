
import {btPresence as BTPresenceTracker} from "bt-presence";

const tracker = new BTPresenceTracker()

tracker.setDevices(['30:D5:3E:BB:50:18'])

tracker.setPingOptions({
    count: 3,
    timeoutSecs: 10,
})

tracker.on('present', () => {
    console.log('Device Present.')
})

tracker.on('not-present', () => {
    console.log('Device lost connection.')
})

tracker.start(true)
