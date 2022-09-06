<template>

  <div class="mx-auto my-24 max-w-xl flex" v-if="!connected">
    <Spinner class="mx-auto"/>
  </div>

  <div class="mx-auto my-24 max-w-xl" v-if="connected">
    <h1 class="font-medium text-4xl tracking-wide">Geräte</h1>

    <div class="my-4" v-if="devicesStatus.length === 0">
      <p class="text-sm text-gray-400 text-center">
        Es sind keine Geräte erfasst...
      </p>
    </div>

    <div class="my-4" v-if="devicesStatus.length > 0">
      <div v-for="{device, status} in devicesStatus" @click="editDevice(device)"
           class="border rounded flex items-center p-4 gap-4 group cursor-pointer transform transition-all hover:scale-105 active:scale-95 select-none"
           :class="{'shadow-lg border-gray-300 text-gray-800': status === 1, 'shadow-sm border-gray-200 text-gray-500': status !== 1}">

        <StatusLight
            :status="status === 1"
            :size="status === 1 ? '3' : '5'"
        />

        <div>
          <p class="text-lg">
            <span v-if="device.name" class="font-bold" v-text="device.name"/>
            <span v-if="!device.name">Unbenanntes Gerät</span>
          </p>
          <p
              class="opacity-0 group-hover:opacity-100 transition font-mono lowercase text-gray-400"
              v-text="device.macAddress"
          />
        </div>
      </div>
    </div>

    <button @click="addDevice" class="rounded-full transform transition-all hover:scale-105 active:scale-95 focus:ring">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="feather feather-plus">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>

  <CreateDeviceModal ref="createDeviceModal"/>
  <EditDeviceModal ref="editDeviceModal"/>

  <!-- Status -->
  <div class="fixed bottom-0 right-0 flex items-center p-2">

    <button @click="startTracking">startTracking</button>
    <button @click="stopTracking">stopTracking</button>

    <StatusLight :status="connected" size="2"/>
    <span v-if="!connected" class="text-xs font-medium ml-2">Verbindung getrennt</span>
    <span v-if="connected" class="text-xs font-medium ml-2">Verbunden</span>
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
import StatusLight from "./components/StatusLight.vue";
import {useBackend} from "./services/backend";
import CreateDeviceModal from "./components/CreateDeviceModal.vue";
import EditDeviceModal from "./components/EditDeviceModal.vue";
import Spinner from "./components/Spinner.vue";

const createDeviceModal = ref(null)
const editDeviceModal = ref(null)

const backend = useBackend()

const connected = computed(() => backend.connected)
const devicesStatus = computed(() => backend.devicesStatus)

onMounted(() => backend.connect())

const editDevice = (device) => editDeviceModal.value.show(device)
const addDevice = () => createDeviceModal.value.show()


const startTracking = () => backend.startTracking()
const stopTracking = () => backend.stopTracking()
</script>
