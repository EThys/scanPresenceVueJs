import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthLoginView from '@/views/auth/AuthLoginView.vue'
import HomePageView from '@/views/HomePageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: AuthLoginView },
    { path: '/home', name: 'home', component: HomePageView }
  ]
})

export default router
