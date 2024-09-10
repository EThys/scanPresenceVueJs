import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthLoginView from '@/views/auth/AuthLoginView.vue'
import HomePageView from '@/views/HomePageView.vue'
import ChangePasswordView from '@/views/auth/ChangePasswordView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: AuthLoginView },
    { path: '/home', name: 'home', component: HomePageView },
    { path: '/changePassword', name: 'changePassword', component: ChangePasswordView },
    { path: '/register', name: 'register', component: RegisterView }
  ]
})

export default router
