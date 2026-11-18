import { useTranslation } from 'react-i18next';
import { languages, languageNames } from '../data/options.js';
import { useProfile } from '../context/ProfileContext.jsx';
export function LanguageSwitcher({ full = false }) {
  const { t, i18n } = useTranslation(); const { changeLanguage } = useProfile();
  return <div className={`language-switcher ${full ? 'language-full' : ''}`} role="group" aria-label={t('common.language')}>
    {languages.map(language => <button key={language} type="button" lang={language} aria-label={languageNames[language]}
      aria-pressed={i18n.language === language} onClick={() => changeLanguage(language)}>
      {full ? languageNames[language] : { en: 'EN', hi: 'हिन्दी', kn: 'ಕನ್ನಡ' }[language]}
    </button>)}
  </div>;
}
