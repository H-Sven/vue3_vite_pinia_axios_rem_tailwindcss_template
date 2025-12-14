import { createRouter, createWebHistory } from 'vue-router';

import { useUserStore } from '@/stores/user';

// 懒加载组件
const Home = () => import('@/views/Home.vue');
const Login = () => import('@/views/Login.vue');
const WebSocketTest = () => import('@/views/WebSocketTest.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/websocket',
      name: 'websocket',
      component: WebSocketTest,
      meta: { requiresAuth: true }
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
