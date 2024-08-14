<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { onMounted, ref, onUnmounted, toRaw } from 'vue'
import { getModels, getFields } from '../../utils/index'
import FieldsInput from '@/components/FieldsInput.vue'
const store = useAppStore()
const localStorageKey = 'anki-last-form-value'
const formValue = ref({
  deckName: undefined,
  modelName: '',
})
const response = ref('')
const deckOptions = ref([])
const modelOptions = ref([])
const fields = ref([])

onMounted(() => {
  chrome.storage.local.get('formValues', (data) => {
    console.log('data.formValues :>> ', data.formValues)

    if (data.formValues) {
      formValue.value = data.formValues
    }
  })
})

onMounted(() => {
  document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: 'getSelectedText' }, (response) => {
      console.log('response.text :>> ', response.text)
    })
  })
})

watch(
  () => formValue.value,
  () => {
    chrome.storage.local.set({ formValues: formValue.value })
  },
  { deep: true }
)

const addNote = async () => {
  try {
    response.value = ''
    const newValue = structuredClone(toRaw(formValue.value))
    delete newValue.deckName
    delete newValue.modelName
    console.log('newValue :>> ', newValue)
    const result = await fetch('http://localhost:8765', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addNote',
        version: 6,
        params: {
          note: {
            deckName: formValue.value.deckName,
            modelName: formValue.value.modelName,
            fields: newValue,
            tags: [],
          },
        },
      }),
    })
    // formValue.value = {}
    Object.keys(newValue).map((key) => {
      formValue.value[key] = ''
    })
    chrome.storage.local.set({ formValues: {} })
    const data = await result.json()
    response.value = data
  } catch (error) {
    response.value = 'Error: ' + error.message
  }
}

function getDecks() {
  return fetch('http://localhost:8765', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'deckNames',
      version: 6,
    }),
  }).then((response) => response.json())
}

getDecks().then((data) => {
  deckOptions.value = data.result.map((name) => ({ value: name, text: name }))
})

getModels().then((data) => {
  modelOptions.value = data.result.map((name) => ({
    value: name,
    text: name,
  }))

  if (!formValue.value.modelName) {
    const modelName = data.result[0] // Lấy modelName đầu tiên
    formValue.value.modelName = modelName
    getFields(modelName).then((fieldsData) => {
      fields.value = fieldsData.result
    })
    return
  }

  getFields(formValue.value.modelName).then((fieldsData) => {
    fields.value = fieldsData.result
  })
})

watch(
  () => formValue.value.modelName,
  () => {
    getFields(formValue.value.modelName).then((fieldsData) => {
      fields.value = fieldsData.result
    })
  }
)

const updateField = (fieldItem) => {
  formValue.value[fieldItem.field] = fieldItem.value
}
</script>

<template>
  <div class="text-center m-4 flex flex-col gap-y-2">
    <form
      @submit.prevent="addNote"
      class="text-left"
    >
      <div class="mb-5">
        <label
          for="word"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
        >
          Deck Info
        </label>
        <div class="flex">
          <select
            class="w-1/2"
            v-model="formValue.deckName"
          >
            <option
              v-for="option in deckOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
          <select
            class="w-1/2"
            v-model="formValue.modelName"
          >
            <option
              v-for="option in modelOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <FieldsInput
        v-for="field in fields"
        :key="field"
        :field="field"
        @update="updateField"
        :value="formValue[field]"
      />
      <button
        type="submit"
        class=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Add
      </button>
      <div
        v-if="response?.error"
        class="mt-4 flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <svg
          class="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
          />
        </svg>
        <span class="sr-only">Info</span>
        <div>
          {{ response?.error }}
        </div>
      </div>
      <div
        v-if="response && !response?.error"
        class="mt-4 flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
        role="alert"
      >
        <svg
          class="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
          />
        </svg>
        <div>
          <span class="font-medium">Success alert!</span>
        </div>
      </div>
    </form>
    <RouterLink
      class="underline"
      to="/common/about"
    >
      About
    </RouterLink>
  </div>
</template>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md bg-blue-500 text-white;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
