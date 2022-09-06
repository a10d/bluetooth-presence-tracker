<template>

  <div class="bg-red-500 border border-red-600 rounded-full shadow-md shadow-red-300"
       :class="sizeClass"
       v-if="!status"/>

  <div class="bg-green-500 border border-green-600 rounded-full shadow-md shadow-green-300"
       :class="sizeClass"
       v-if="status"/>

</template>

<script setup>

import {computed} from "vue";

const props = defineProps({
  status: {
    type: Boolean,
    required: true
  },
  size: {
    type: String,
    default: '3'
  }
})


const sizeClass = computed(() => {
  return {
    '1': 'w-1 h-1',
    '2': 'w-2 h-2',
    '3': 'w-3 h-3',
    '4': 'w-4 h-4',
    '5': 'w-5 h-5',
    '6': 'w-6 h-6',
  }[props.size.toString()]
})

</script>
