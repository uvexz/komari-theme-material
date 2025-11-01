import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';

// 从 localStorage 获取保存的语言，或使用浏览器语言
const savedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language.toLowerCase();

// 确定默认语言
let defaultLanguage = 'en';
if (savedLanguage) {
  defaultLanguage = savedLanguage;
} else if (browserLanguage.startsWith('en')) {
  defaultLanguage = 'en';
} else if (browserLanguage.startsWith('ja')) {
  defaultLanguage = 'ja';
} else if (browserLanguage.startsWith('zh')) {
  defaultLanguage = 'zh';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ja: { translation: ja }
    },
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
