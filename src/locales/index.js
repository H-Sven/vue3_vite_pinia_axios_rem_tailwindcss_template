import { createI18n } from 'vue-i18n';

import en from './en';
import zh from './zh';

// 获取本地存储的语言设置
const getLocale = () => {
  const defaultLocale = 'zh';
  try {
    const appStore = localStorage.getItem('app-store');
    if (appStore) {
      const { language } = JSON.parse(appStore);
      return language || defaultLocale;
    } else {
      return defaultLocale;
    }
  } catch (e) {
    console.warn('Failed to parse app-store from localStorage', e);
    return defaultLocale;
  }
};

const i18n = createI18n({
  legacy: false, // 组合式 API 模式
  locale: getLocale(), // 默认语言
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
});

export default i18n;
