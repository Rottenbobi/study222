import { createRouter, createWebHistory } from 'vue-router'
import AiChat from '../components/AiChat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('@/views/ListView.vue')
    },
    {
      path: '/threeJs',
      name: 'threeJs',
      component: () => import('@/views/threeJs/index.vue')
    },
    {
      path: '/luckydraw',
      name: 'luckydraw',
      component: () => import('@/views/luckydraw.vue')
    },
    {
      path: '/todolist',
      name: 'todolist',
      component: () => import('@/views/todolist.vue')
    },
    {
      path: '/ai-chat',
      name: 'AiChat',
      component: AiChat,
    }
  ]
})

export default router