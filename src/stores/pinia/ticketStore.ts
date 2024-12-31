// stores/counterStore.js
import { defineStore } from 'pinia'
import { useAxiosRequestWithToken } from '@/utils/service/axios_api'
import { ref } from 'vue'
import { ApiRoutes } from '@/utils/service/endpoints/api'
import type { ITicket } from '@/utils/interface/ITicket'

export const useTicketStore = defineStore('ticket', () => {
  const TicketList = ref<Array<ITicket>>([{} as ITicket])
  const isDataLoaded = ref(false)

  const fetchTickets = async (token: string) => {
    if (!isDataLoaded.value) {
      try {
        const response = await useAxiosRequestWithToken(token).get(`${ApiRoutes.getAllTickets}`)
        TicketList.value = response.data.tickets
        isDataLoaded.value = true 
      } catch (error) {
        console.error(error)
      }
    }
  }



  return { fetchTickets,TicketList }
})
