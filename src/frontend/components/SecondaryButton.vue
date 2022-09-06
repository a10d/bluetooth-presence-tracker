<template>
  <button :type="type"
          class="border border-gray-700 text-gray-700 rounded-lg px-4 py-2 font-bold relative select-none"
          @click="onClick"
          :disabled=" disabled">
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script setup>

defineProps({
  type: {
    type: String,
    default: 'submit',
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
