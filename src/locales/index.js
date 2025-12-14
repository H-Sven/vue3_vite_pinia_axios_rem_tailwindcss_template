import { createI18n } from 'vue-i18n';
import en from './en';
import zhCN from './zh-CN';

const i18n = createI18n({
  legacy: false, // 组合式 API 模式
  locale: 'zh-CN', // 默认语言
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN
  }
});

export default i18n;
