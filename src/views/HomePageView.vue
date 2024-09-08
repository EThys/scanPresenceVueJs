<script lang="ts" setup>
import { ref } from 'vue'
//@ts-ignore
import NavBar from '@/components/navbar/NavBar.vue'
//@ts-ignore
import { useAxiosRequestWithTokenForCsv } from '@/utils/service/axios_api'
//@ts-ignore
import { ApiRoutes } from '@/utils/service/endpoints/api'
import { useRouter } from 'vue-router'
//@ts-ignore
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const router = useRouter()
const toast = useToast()
const loading = ref<Boolean>(false)
const isCategorySearchOpen = ref(false)
const isChecked = ref<boolean>(false)
const selectedItem = ref('All')
const showSortOptions = ref<boolean>(false)
const advancedSearch = ref<boolean>(false)
const toggleSortOptions = () => {
  showSortOptions.value = !showSortOptions.value
}
const toggleAdvancedSearch = () => {
  advancedSearch.value = !advancedSearch.value
}
const items = ref(['qrcode', 'BarCode', 'UserName', 'Date'])

const selectItem = (item: string) => {
  selectedItem.value = item
  isCategorySearchOpen.value = false
}
const toggleSwitch = () => {
  isChecked.value = !isChecked.value
}
const toggleCategorySearchOpen = () => {
  isCategorySearchOpen.value = !isCategorySearchOpen.value
}
const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref<string | null>(null)

const openFilePicker = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null

  if (file && file.type === 'text/csv') {
    fileName.value = file.name

    const formData = new FormData()
    formData.append('file', file)

    // fetch('/upload-csv', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     'X-CSRF-TOKEN':
    //       document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
    //   }
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('Success:', data)
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error)
    //   })
  } else {
    alert('Please upload a valid CSV file.')
  }
}
const uploadedFiles = new Set()
const importCsv = async () => {
  if (!fileInput.value || !fileInput.value.files?.length) {
    toast.open({
      message: 'Please select a CSV file to upload.',
      type: 'warning',
      position: 'bottom',
      duration: 5000
    })
    return
  }

  loading.value = true
  const formData = new FormData()
  formData.append('file', fileInput.value.files[0])
  console.log(fileInput.value.files[0])
  console.log(formData.append)

  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const networkTimeout = setTimeout(() => {
    abortController.abort()
    loading.value = false
    toast.open({
      message: 'Network Error, please check your internet.',
      type: 'error',
      position: 'bottom',
      duration: 5000
    })
  }, 30000)

  await useAxiosRequestWithTokenForCsv()
    .post(`${ApiRoutes.uploadCsv}`, formData, { signal: abortSignal })
    .then(function (response) {
      clearTimeout(networkTimeout)
      toast.open({
        message: 'CSV imported successfully!',
        type: 'success',
        position: 'bottom',
        duration: 5000
      })
      loading.value = false
    })
    .catch(function (error) {
      clearTimeout(networkTimeout)
      console.log(formData)
      toast.open({
        message: error,
        type: 'error',
        position: 'bottom',
        duration: 5000
      })
      loading.value = false
    })
}
</script>

<template>
  <NavBar />

  <div class="mt-10">
    <form style="width: 69%" class="mx-auto">
      <div class="flex">
        <label
          for="search-dropdown"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Your Email</label
        >
        <button
          id="dropdown-button"
          @click="toggleCategorySearchOpen"
          class="flex-shrink-0 z-10 inline-flex items-center py-2 px-2 text-sm font-medium text-center text-white bg-gray-500 border border-gray-300 rounded-s-md hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          type="button"
        >
          {{ selectedItem }}
          <svg
            class="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <div class="absolute mt-10" :aria-expanded="isCategorySearchOpen">
          <div
            :class="{ hidden: !isCategorySearchOpen }"
            class="menu absolute right-50 z-10 mt-2 w-40 origin-top-right rounded-sm bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabindex="-1"
          >
            <a
              v-for="item in items"
              :key="item"
              @click="selectItem(item)"
              class="px-4 py-2 hover:bg-gray-200 text-sm text-black cursor-pointer flex items-center justify-between"
              role="menuitem"
              tabindex="-1"
              id="user-menu-item-0"
            >
              {{ item }}
            </a>
          </div>
        </div>

        <div class="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            class="block py-2 px-4 w-full z-20 text-lg text-gray-900 bg-white rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="What are you looking for?"
            required
          />
          <button
            type="submit"
            class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-gray-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span class="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  </div>
  <div class="mt-10">
    <form style="width: 69%" class="mx-auto">
      <!-- Existing form content -->
      <div class="flex justify-center mt-6 space-x-4">
        <input
          type="file"
          accept=".csv"
          ref="fileInput"
          class="hidden"
          @change="handleFileUpload"
        />
        <button
          type="button"
          @click="openFilePicker"
          class="flex items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <svg
            class="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Import CSV
        </button>

        <button
          type="button"
          @click="importCsv"
          class="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            class="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Update Database
        </button>
      </div>

      <div v-if="fileName" class="text-center mt-2 text-gray-700 dark:text-white">
        Uploaded file: {{ fileName }}
      </div>
    </form>
  </div>
</template>
