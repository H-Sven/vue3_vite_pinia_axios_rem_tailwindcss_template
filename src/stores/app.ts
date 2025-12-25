import { defineStore } from 'pinia';

import i18n from '@/locales';

interface AppState {
  language: string;
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    language: 'zh',
  }),
  actions: {
    /**
     * 设置语言
     * @param {string} lang 语言代码
     */
    setLanguage(lang: string) {
      this.language = lang;
      // @ts-ignore
      i18n.global.locale.value = lang;
      // 设置 HTML 标签的 lang 属性
      document.documentElement.lang = lang;
    },
    /**
     * 初始化语言设置
     * 用于在应用启动时同步 i18n 和 store 的状态
     */
    initLanguage() {
      if (this.language) {
        // @ts-ignore
        i18n.global.locale.value = this.language;
        document.documentElement.lang = this.language;
      }
    }
  },
  persist: {
    key: 'app-store',
    pick: ['language'],
  },
});
