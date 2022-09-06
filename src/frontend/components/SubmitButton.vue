<template>
  <button :type="type"
          class=" bg-black rounded-lg text-white px-4 py-2 font-bold relative select-none disabled:opacity-50"
          @click="onClick"
          :disabled="isLoading || disabled">

    <span class="absolute flex inset-0" v-if="isLoading">
      <Spinner class="m-auto light" />
    </span>

    <span :class="{'opacity-0': isLoading}">
      <slot>
        {{ label }}
      </slot>
    </span>

  </button>
</template>

<script setup>

import Spinner from './Spinner.vue'

defineProps({
  type: {
    type: String,
    default: 'submit',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])

const onClick = (e) => emit('click', e)

</script>
