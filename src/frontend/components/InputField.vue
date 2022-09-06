<template>
  <select
      v-if="type === 'select'"
      :name="name"
      :id="name"
      :value="value"
      @change="onInput"
      :required="required"
      :disabled="disabled"
      class="w-full px-2 py-2 border border-gray-500 rounded shadow-sm bg-white"
  >
    <option
        v-for="{value, label, disabled} in selectOptions"
        :value="value"
        v-text="label"
        :disabled="disabled"
    />
  </select>
  <input
      v-else-if="type==='number'"
      :name="name"
      :id="name"
      :type="type"
      :required="required"
      :disabled="disabled"
      class="w-full px-2 py-2 border border-gray-500 rounded shadow-sm"
      @input="onInput"
      :value="value"
      :min="min"
      :max="max"
      :step="step"
  />
  <textarea
      v-else-if="type==='textarea'"
      :name="name"
      :id="name"
      :required="required"
      :disabled="disabled"
      class="w-full px-2 py-2 border border-gray-500 rounded shadow-sm"
      @input="onInput"
      :value="value"
  />
    <input
        v-else-if="type==='file'"
        :name="name"
        :id="name"
        type="file"
        :required="required"
        :disabled="disabled"
        class="w-full px-2 py-2 border border-gray-500 rounded shadow-sm"
        @change="onSelectFile"
    />
  <input
      v-else
      :name="name"
      :id="name"
      :type="type"
      :required="required"
      :disabled="disabled"
      class="w-full px-2 py-2 border border-gray-500 rounded shadow-sm"
      @input="onInput"
      :value="value"
  />
</template>

<script setup>

defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  selectOptions: {
    type: Array,
    default: () => [],
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
  value: {
    type: [String, Number, Boolean, File, null],
    default: '',
  },
})

const emit = defineEmits(['update:value'])

const onInput = (e) => emit('update:value', e.target.value)

const onSelectFile = (e) => {
    emit('update:value', e.target.files[0]);
}

</script>
