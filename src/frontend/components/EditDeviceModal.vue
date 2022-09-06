<template>
  <modal
      :show="editingDevice !== null"
      :closeable="!isSubmitting"
      @close="onCancel">


    <form @submit.prevent="onSubmit">

      <fieldset class="p-5" :disabled="isSubmitting">

        <h2 class="font-medium text-xl tracking-wide mb-4">Gerät bearbeiten:</h2>

        <p class="text-sm font-bold">MAC Adresse:</p>
        <p class="font-mono text-gray-600 p-2 lowercase" v-text="form.macAddress"/>
        <p class="text-xs text-gray-600 mb-4">Die MAC Adresse kann nicht bearbeitet werden...</p>

        <form-field
            name="name"
            label="Name:"
            :required="false"
            v-model="form.name"
        />

      </fieldset>

      <div class="p-5 border-t bg-gray-50 flex">

        <button
            type="button"
            @click="onRemoveDevice"
            :disabled="isSubmitting" class="mr-auto text-red-700 hover:underline cursor-pointer">
          Gerät löschen
        </button>


        <secondary-button class="ml-auto mr-5" @click="onCancel" :disabled="isSubmitting">
          Abbrechen
        </secondary-button>

        <submit-button :is-loading="isSubmitting" :disabled="isSubmitting">
          Sichern
        </submit-button>
      </div>
    </form>
  </modal>

  <RemoveDeviceModal ref="removeDeviceModal" @deleted="onCancel"/>
</template>

<script setup>

import {reactive, ref} from "vue";
import Modal from "./Modal.vue";
import SubmitButton from "./SubmitButton.vue";
import SecondaryButton from "./SecondaryButton.vue";
import FormField from "./FormField.vue";
import {useBackend} from "../services/backend";
import RemoveDeviceModal from "./RemoveDeviceModal.vue";

const removeDeviceModal = ref(null)
const editingDevice = ref(null)
const isSubmitting = ref(false)

const backend = useBackend()

const show = (device) => {
  editingDevice.value = device

  form.macAddress = device.macAddress
  form.name = device.name
}

const onCancel = () => {
  editingDevice.value = null

  isSubmitting.value = false

  form.macAddress = ''
  form.name = ''
}

const form = reactive({
  macAddress: '',
  name: '',
})

const onRemoveDevice = () => {
  removeDeviceModal.value.show(editingDevice.value)
}

const onSubmit = async () => {
  isSubmitting.value = true
  try {
    backend.updateDevice(form)

    onCancel()
  } catch (e) {
    console.error('Could not update device', e)
  }
  isSubmitting.value = false
}

defineExpose({
  show,
})

</script>
