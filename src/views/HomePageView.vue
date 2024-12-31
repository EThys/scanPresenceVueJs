<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
//@ts-ignore<script lang="ts" setup>
import { useTicketStore } from '@/stores/pinia/ticketStore'
//@ts-ignore<script lang="ts" setup>
import NavBar from '@/components/navbar/NavBar.vue'
//@ts-ignore<script lang="ts" setup>
import { useAxiosRequestWithTokenForCsv } from '@/utils/service/axios_api'
//@ts-ignore<script lang="ts" setup>
import { useAxiosRequestWithToken } from '@/utils/service/axios_api'
//@ts-ignore<script lang="ts" setup>
import { ApiRoutes } from '@/utils/service/endpoints/api'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
//@ts-ignore<script lang="ts" setup>
import { getToken } from '@/stores/token'
import 'vue-toast-notification/dist/theme-sugar.css'
//@ts-ignore<script lang="ts" setup>
import type { ITicket } from '@/utils/interface/ITicket'

const token = getToken() as string
const toast = useToast()
const loading = ref<Boolean>(false)
const isCategorySearchOpen = ref(false)
const selectedItem = ref('All')
const query = ref('');
const searchResults = ref<Array<ITicket>>([{} as ITicket]);


const items = ref(['All',])
const selectItem = (item: string) => {
  selectedItem.value = item
  isCategorySearchOpen.value = false
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
  } else {
    alert('Veuillez télécharger un fichier CSV valide.')
  }
}
const refreshPage = async() => {
   ticketStore.fetchTickets(token); 
  searchResults.value = ticketStore.TicketList;
 
}

const searchTickets = async () => {
    if (!query.value) {
        toast.open({
            message: 'Veuillez entrer un terme de recherche.',
            type: 'warning',
            position: 'bottom',
            duration: 5000,
        });
        return;
    }

    loading.value = true;
    searchResults.value = []; // Réinitialiser les résultats avant une nouvelle recherche

    try {
      const response = await useAxiosRequestWithToken(token).get(
      `${ApiRoutes.searchTicket}`, {
        params: { query: query.value }})
        
        searchResults.value = response.data.tickets
        console.log("matakuu", searchResults.value)
    } catch (error:any) {
        toast.open({
            message: error.message || 'Une erreur est survenue lors de la recherche.',
            type: 'error',
            position: 'bottom',
            duration: 5000,
        });
    } finally {
        loading.value = false;
    }
};

const ticketStore = useTicketStore()
onMounted(() => {
  ticketStore.fetchTickets(token)
})
const importCsv = async () => {
  if (!fileInput.value || !fileInput.value.files?.length) {
    toast.open({
      message: 'Veuillez sélectionner un fichier CSV à télécharger.',
      type: 'warning',
      position: 'bottom',
      duration: 5000
    })
    return
  }

  loading.value = true
  const formData = new FormData()
  formData.append('file', fileInput.value.files[0])

  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const networkTimeout = setTimeout(() => {
    abortController.abort()
    loading.value = false
    toast.open({
      message: 'Erreur réseau, veuillez vérifier votre connexion Internet.',
      type: 'error',
      position: 'bottom',
      duration: 5000
    })
    resetFileInput() // Réinitialiser le champ de fichier en cas d'erreur réseau
  }, 30000)

  await useAxiosRequestWithTokenForCsv()
    .post(`${ApiRoutes.uploadCsv}`, formData, { signal: abortSignal })
    .then(function (response) {
      clearTimeout(networkTimeout)
      ticketStore.fetchTickets(token); 
     
      toast.open({
        message: 'CSV importé avec succès!',
        type: 'success',
        position: 'bottom',
        duration: 5000
      })
      loading.value = false
      resetFileInput() 
    })
    .catch(function (error) {
      clearTimeout(networkTimeout)
      toast.open({
        message: error.message || 'Une erreur est survenue lors de l\'importation.',
        type: 'error',
        position: 'bottom',
        duration: 5000
      })
      loading.value = false
      resetFileInput() 
    })
}

const updatePresence = async (ticketId:any, presence:any) => {
  try {
    const response = await useAxiosRequestWithToken(token).post(
      ApiRoutes.updatePresence(ticketId), 
      { presence }
    );
      console.log('Response:', response);

    const index = searchResults.value.findIndex(ticket => ticket.TicketId === ticketId);
    if (index !== -1) {
      searchResults.value[index].presence = presence;
    }

    const ticketIndex = ticketStore.TicketList.findIndex(ticket => ticket.TicketId === ticketId);
    console.log('BERDINIHOOOOOOOOOOO:', ticketIndex);
    if (ticketIndex !== -1) {
      ticketStore.TicketList[ticketIndex].presence = presence;
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

const resetFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = '' 
    fileName.value = null 
  }
}
</script>

<template>
  <NavBar />

  <div class="mt-10">
    <form style="width: 69%" class="mx-auto" @submit.prevent="searchTickets">
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
            v-model="query"
            class="block py-2 px-4 w-full z-20 text-lg text-gray-900 bg-white rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Que cherchez-vous ?"
            
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
            <span class="sr-only">Recherche</span>
          </button>
        </div>
      </div>
    </form>
  </div>
  <div class="flex mt-4">
    <form class="mx-auto max-w-2xl p-4">
    <div class="flex flex-col md:flex-row justify-center mt-6 space-y-4 md:space-y-0 md:space-x-4">
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
        class="flex items-center justify-center px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-auto transition duration-200 ease-in-out"
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
        Importer CSV
      </button>

      <button
        type="button"
        @click="importCsv"
        class="flex items-center justify-center px-6 py-3 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full md:w-auto transition duration-200 ease-in-out"
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
        Mise à jour base de données
      </button>

      <button
        type="button"
        @click="refreshPage"
        class="flex items-center justify-center px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-auto transition duration-200 ease-in-out"
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
            d="M4 6v6h6M20 18v-6h-6M4 18a9 9 0 109-9H4z"
          />
        </svg>
        Rafraîchir
      </button>
    </div>

    <div v-if="fileName" class="text-center mt-2 text-gray-700 dark:text-white">
      Fichier téléchargé: {{ fileName }}
    </div>
  </form>
</div>
<div class="mt-5 overflow-x-auto px-4 md:px-8">
    <h1 class="text-2xl font-bold mb-4 text-center">Liste d'Invités</h1>
    <div>
        <table class="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden bg-white">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postnom</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de Personnes</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Civilité</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Présence</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <template v-if="loading">
                    <tr>
                        <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            Chargement...
                        </td>
                    </tr>
                </template>
                <template v-else-if="!loading && ticketStore.TicketList.length === 0">
                    <tr>
                        <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            Aucune donnée disponible pour le moment.
                        </td>
                    </tr>
                </template>
                <template v-else-if="searchResults.length > 0">
                    <tr v-for="ticket in searchResults" :key="ticket.TicketId" class="hover:bg-gray-100 transition duration-150 ease-in-out">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ ticket.nom }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ticket.postnom }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ticket.prenom }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ticket.nombre_des_personnes }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ticket.civilite }}</td>
                        
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input type="checkbox" v-model="ticket.presence" @change="updatePresence(ticket.TicketId, ticket.presence)" />

                            <!-- <input type="checkbox" 
                                   :checked="ticket.presence === 1 || ticket.presence === 1" 
                                   @change="updatePresence(ticket.TicketId, $event.target?.checked)" /> -->
                        </td>
                    </tr>
                </template>
                <template v-if="!loading && searchResults.length === 0">
                    <tr>
                        <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            Aucun invité trouvé.
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</div>




</template>
