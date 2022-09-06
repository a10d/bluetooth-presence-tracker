<template>

</template>

<script setup lang="ts">

import {io} from 'socket.io-client'
import {onMounted} from "vue";

onMounted(() => {
  const socket = io.connect()

  socket.on('started-tracking', (data: any) => console.log('started tracking', data))
})
</script>
