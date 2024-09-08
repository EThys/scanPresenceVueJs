<script lang="ts" setup>
import { ref } from 'vue'
//@ts-ignore
import NavBar from '@/components/navbar/NavBar.vue'

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
            <!-- Active: "bg-gray-100", Not Active: "" -->
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
</template>
