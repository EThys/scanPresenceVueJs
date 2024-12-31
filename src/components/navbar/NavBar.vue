<script setup lang="ts">
//@ts-ignore
import { clearUser, getUser } from '@/stores/user'
//@ts-ignore
import { clearToken } from '@/stores/token'

import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const isProfileMenuOpen = ref(false)

function toggleProfileMenu() {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

const user = getUser()
const logout = () => {
  clearUser(), clearToken(), router.push('/')
}

const name = 'Nav'
</script>

<template>
  <nav class="bg-cyan-500" style="position: sticky; top: 0; z-index: 100">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button @click="toggleProfileMenu" type="button" class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
  
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <ul class="flex space-x-4">
              <li>
                <router-link class="text-lg text-white font-semibold" to="/home">
                  CheckInvite <span class="bg-gray-500 sm:text-sm px-2 rounded-sm">Version 1</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button
            type="button"
            @click="toggleProfileMenu"
            class="relative rounded-full bg-cyan-500 p-1 text-white font-semibold text-md hover:text-white sm:hidden"
          >
            {{ user?.user.userName }}
            <i class="fas fa-caret-down"></i>
          </button>
          <div class="hidden sm:block">
            <!-- Profile dropdown for larger screens -->
            <button
              type="button"
              @click="toggleProfileMenu"
              class="relative rounded-full bg-cyan-500 p-1 text-white font-semibold text-md hover:text-white"
            >
              {{ user?.user.userName }}
              <i class="fas fa-caret-down"></i>
            </button>
          </div>
          <!-- Profile dropdown -->
          <div class="relative mt-4" :aria-expanded="isProfileMenuOpen">
            <div
              :class="{ hidden: !isProfileMenuOpen }"
              class="menu absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-sm bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <a class="block px-4 py-2 text-sm text-black cursor-pointer" role="menuitem" tabindex="-1" id="user-menu-item-0">
                <router-link class="flex items-center justify-between" to="/changePassword">
                  Changer Mot de passe <i class="fa-solid fa-key"></i>
                </router-link>
              </a>
              <a @click="logout" href="" class="px-4 py-2 text-sm text-black cursor-pointer flex items-center justify-between" role="menuitem" tabindex="-1" id="user-menu-item-1">
                Se déconnecter <i class="fa-solid fa-sign-out-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
#navlinks {
  display: flex;
  justify-content: center;
  color: white;
  font-size: 18px;
}
</style>
