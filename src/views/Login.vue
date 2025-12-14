<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="px-8 py-6 mt-4 text-left bg-white shadow-lg w-[375px]">
      <h3 class="text-2xl font-bold text-center">{{ $t('message.login') }}</h3>
      <form @submit.prevent="handleLogin">
        <div class="mt-4">
          <div>
            <label class="block" for="username">{{ $t('message.username') }}</label>
            <input v-model="username" type="text" placeholder="admin"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
          </div>
          <div class="mt-4">
            <label class="block" for="password">{{ $t('message.password') }}</label>
            <input v-model="password" type="password" placeholder="123456"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
          </div>
          <div class="flex items-baseline justify-between">
            <button class="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                {{ $t('message.submit') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@/stores/user';

const username = ref('admin');
const password = ref('123456');
const router = useRouter();
const userStore = useUserStore();

/**
 * 处理登录逻辑
 */
const handleLogin = () => {
  // 模拟登录
  if (username.value && password.value) {
    userStore.setToken('mock-token');
    userStore.setUserInfo({ name: username.value });
    router.push({ name: 'home' });
  }
};
</script>
