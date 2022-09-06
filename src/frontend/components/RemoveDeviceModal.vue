<template>
  <modal :show="deletingDevice !== null"
         :closeable="!isSubmitting"
         @close="onCancel">

    <div class="p-5">
      <h2 class="font-medium text-xl tracking-wide mb-4">Gerät löschen?</h2>
      <p>Sicher dass Du das Gerät löschen möchtest?</p>
    </div>

    <div class="p-5 border-t bg-gray-50 flex">


      <secondary-button class="ml-auto mr-5" @click="onCancel" :disabled="isSubmitting">
        Abbrechen
      </secondary-button>

      <submit-button :is-loading="isSubmitting" :disabled="isSubmitting" @click="onDelete">
        Löschen
      </submit-button>
    </div>
  </modal>
</template>

<script setup>


import Modal from "./Modal.vue";
import {ref} from "vue";
import SubmitButton from "./SubmitButton.vue";
import SecondaryButton from "./SecondaryButton.vue";
import {useBackend} from "../services/backend";


const emit = defineEmits([
  'deleted'
])
const backend = useBackend()

const deletingDevice = ref(null)
const isSubmitting = ref(false)

const show = (device) => {
  deletingDevice.value = device
}

const onCancel = () => {
  deletingDevice.value = null
}

const onDelete = async () => {
  isSubmitting.value = true

  try {
    await backend.removeDevice(deletingDevice.value)
    deletingDevice.value = null

    emit('deleted')
  } catch (e) {
    console.error('Error while trying to delete device', e)
  }

  isSubmitting.value = false
}

defineExpose({
  show,
})

</script>
