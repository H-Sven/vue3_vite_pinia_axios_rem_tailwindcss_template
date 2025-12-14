<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 class="text-4xl font-bold mb-8">{{ $t('message.welcome') }}, {{ userStore.userInfo?.name }}</h1>
    
    <div class="space-x-4">
      <button class="px-4 py-2 bg-green-500 text-white rounded" @click="changeLanguage('zh-CN')">中文</button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded" @click="changeLanguage('en')">English</button>
    </div>

    <div class="mt-8 space-x-4">
        <router-link to="/websocket" class="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 inline-block">
            WebSocket 测试
        </router-link>
    </div>

    <button class="mt-8 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600" @click="handleLogout">
      退出登录
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();
const { locale } = useI18n();

/**
 * 切换语言
 * @param {string} lang 语言代码
 */
const changeLanguage = (lang) => {
  locale.value = lang;
};

/**
 * 退出登录
 */
const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'login' });
};
</script>
