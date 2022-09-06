<template>
  <div class="mb-2">
    <label
        class="text-sm font-bold"
        :for="name"
        v-text="label ?? name"
    />
  </div>
  <div class="mb-4">
    <input-field
        :type="type"
        :select-options="selectOptions"
        :name="name"
        :required="required"
        :disabled="disabled"
        v-model:value="valueProxy"
        :min="min"
        :max="max"
        :step="step"
    />
  </div>
</template>

<script setup>

import InputField from './InputField.vue'
import {computed} from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null,
  },
  type: {
    type: String,
    default: 'text',
  },
  selectOptions: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: null,
  },
  max: {
    type: Number,
    default: null,
  },
  step: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const valueProxy = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>
