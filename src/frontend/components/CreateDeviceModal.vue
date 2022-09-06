<template>
  <modal
      :show="modalVisible"
      :closeable="!isSubmitting"
      @close="onCancel">

    <form @submit.prevent="onSubmit">
      <fieldset class="p-5" :disabled="isSubmitting">

        <h2 class="font-medium text-xl tracking-wide mb-4">Gerät erfassen:</h2>

        <form-field
            name="macAddress"
            label="MAC Adresse:"
            :required="true"
            v-model="form.macAddress"
        />

        <form-field
            name="name"
            label="Name:"
            :required="false"
            v-model="form.name"
        />
      </fieldset>

      <div class="p-5 border-t bg-gray-50 flex">

        <secondary-button class="ml-auto mr-5" @click="onCancel" :disabled="isSubmitting">
          Abbrechen
        </secondary-button>

        <submit-button :is-loading="isSubmitting" :disabled="isSubmitting">
          Sichern
        </submit-button>
      </div>
    </form>

  </modal>
</template>

<script setup>


import Modal from "./Modal.vue";
import {reactive, ref} from "vue";
import SubmitButton from "./SubmitButton.vue";
import SecondaryButton from "./SecondaryButton.vue";
import FormField from "./FormField.vue";
import {useBackend} from "../services/backend";

const form = reactive({
  macAddress: '',
  name: '',
})

const modalVisible = ref(false)
const isSubmitting = ref(false)

const backend = useBackend()

const show = () => {
  form.macAddress = ''
  form.name = ''
  modalVisible.value = true
}

const onCancel = () => {
  modalVisible.value = false
  isSubmitting.value = false
}

const onSubmit = async () => {
  isSubmitting.value = true
  try {
    backend.addDevice(form)

    onCancel()
  } catch (e) {
    console.error('Could not create device', e)
  }
  isSubmitting.value = false
}

defineExpose({
  show,
})

</script>
