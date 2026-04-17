import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
  ja: { translation: ja },
};

const browserLanguage = typeof navigator !== 'undefined' ? navigator.language?.slice(0, 2) : 'ko';
const fallbackLanguage = ['ko', 'en', 'ja'].includes(browserLanguage) ? browserLanguage : 'ko';

i18n.use(initReactI18next).init({
  resources,
  lng: fallbackLanguage,
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});

export default i18n;
