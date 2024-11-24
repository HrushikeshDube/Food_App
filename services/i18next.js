import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from "../locales/en.json";
import hin from "../locales/hin.json";
import mara from "../locales/mara.json";
import span from "../locales/spanish.json"
import jap from "../locales/japan.json"
export const languageResources = {
  en: {translation: en},
  hin: {translation: hin},
  mara: {translation: mara},
  jap: {translation: jap},
  span: {translation: span},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export default i18next;