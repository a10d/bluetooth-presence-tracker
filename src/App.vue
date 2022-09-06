<template>

</template>

<script setup lang="ts">

import {connect as useSocket} from 'socket.io-client'
import {onMounted} from "vue";

const socket = useSocket()


socket.on('started-tracking', (data: any) => console.log('started tracking', data))

</script>
