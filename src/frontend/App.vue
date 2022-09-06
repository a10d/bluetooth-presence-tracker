<template>

  <div v-if="connected">
    Is connected
  </div>


  <div v-if="!connected">
    <small>Connecting to service...</small>
  </div>

</template>

<script setup lang="ts">

import {connect as useSocket} from 'socket.io-client'
import {computed, onMounted, ref} from "vue";

const socket = useSocket()

const connected = computed(() => socket.connected)



socket.on('started-tracking', (data: any) => console.log('started tracking', data))

</script>
