import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, hi, kn } from './locales.js';
import { schemeCopy } from './schemes.js';
let language = 'en';
try { const stored = localStorage.getItem('mygovguide.language'); if (['en', 'hi', 'kn'].includes(stored)) language = stored; } catch { /* private browsing may restrict storage */ }
i18n.use(initReactI18next).init({ resources: { en: { translation: {...en,schemes:schemeCopy.en} }, hi: { translation: {...hi,schemes:schemeCopy.hi} }, kn: { translation: {...kn,schemes:schemeCopy.kn} } },
  lng: language, fallbackLng: 'en', supportedLngs: ['en', 'hi', 'kn'], interpolation: { escapeValue: false }, returnNull: false });
document.documentElement.lang = language;
i18n.on('languageChanged', lang => { document.documentElement.lang = lang; });
export default i18n;
