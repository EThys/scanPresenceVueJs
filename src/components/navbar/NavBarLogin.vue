<script setup lang="ts">
import { ref } from 'vue'
const  isMenuOpen= ref(false)
const toggleMenu=() =>{
    isMenuOpen.value = !isMenuOpen.value;
}

const name = 'Nav'
</script>

<template>
  <nav class="bg-cyan-500" style="position: sticky; top: 0; z-index: 100">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <ul>
              <li>
                <router-link class="text-lg text-white font-semibold" to="/">
                  CheckInvite <span class="bg-gray-500 px-2 rounded-sm">Version 1.0</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center sm:hidden">
          <button @click="toggleMenu" class="text-white focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <ul :class="{ 'hidden': !isMenuOpen, 'block': isMenuOpen }" class="absolute inset-x-0 top-full bg-cyan-500 py-4 px-2 sm:static sm:flex sm:flex-row sm:bg-transparent sm:space-x-5">
            <li class="text-lg">
              <router-link class="flex items-center justify-between text-white" to="/">
                Connexion
              </router-link>
            </li>
            <li class="text-lg">
              <router-link class="flex items-center justify-between text-white" to="/register">
                Inscription
              </router-link>
            </li>
          </ul>
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
