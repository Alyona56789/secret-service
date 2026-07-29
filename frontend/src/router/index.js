import { createRouter, createWebHistory } from 'vue-router'
import CreateSecret from '../components/CreateSecret.vue'
import ViewSecret from '../components/ViewSecret.vue'

const routes = [
  { path: '/', component: CreateSecret },
  { path: '/:hash', component: ViewSecret } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router