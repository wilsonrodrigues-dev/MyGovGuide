import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, Sprout, GraduationCap, HeartHandshake, UserRound, BriefcaseBusiness, HardHat, Accessibility, Users, LockKeyhole, LoaderCircle } from 'lucide-react';
import { categories, states, stateName, languages, languageNames, isProfile } from '../data/options.js';
import { useProfile } from '../context/ProfileContext.jsx';
import { Button } from './ui/button.jsx';
const icons = [Sprout, GraduationCap, HeartHandshake, UserRound, BriefcaseBusiness, HardHat, Accessibility, Users];
export function PreferenceForm({ initial, editing = false, onSaved }) {
  const { t, i18n } = useTranslation(); const { saveProfile, changeLanguage } = useProfile();
  const [state, setState] = useState(initial?.state || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [errors, setErrors] = useState({}); const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const profile = { state, category, language: i18n.language };
    const nextErrors = { ...(!states.includes(state) ? { state: t('onboarding.stateError') } : {}),
      ...(!categories.includes(category) ? { category: t('onboarding.categoryError') } : {}),
      ...(!languages.includes(profile.language) ? { language: t('onboarding.languageError') } : {}) };
    setErrors(nextErrors);
    if (!isProfile(profile)) { document.getElementById(!state ? 'state' : 'category-0')?.focus(); return; }
    setSaving(true); await saveProfile(profile); setSaving(false); onSaved?.();
  }
  return <form onSubmit={submit} noValidate className="preferences-form">
    <div className="form-section"><div className="form-section-title"><span className="step-number">01</span><label htmlFor="state">{t('onboarding.stateLabel')}</label></div>
      <select id="state" name="state" value={state} onChange={event => { setState(event.target.value); setErrors(s => ({ ...s, state: '' })); }}
        aria-invalid={Boolean(errors.state)} aria-describedby={errors.state ? 'state-error' : undefined}>
        <option value="">{t('onboarding.statePlaceholder')}</option>{states.map(s => <option key={s} value={s}>{stateName(s, i18n.language)}</option>)}
      </select>{errors.state && <p id="state-error" className="field-error" role="alert">{errors.state}</p>}
    </div>
    <fieldset className="form-section" aria-describedby={`category-hint${errors.category ? ' category-error' : ''}`}>
      <legend className="form-section-title"><span className="step-number">02</span>{t('onboarding.categoryLabel')}</legend><p id="category-hint" className="field-hint">{t('onboarding.categoryHint')}</p>
      <div className="category-grid">{categories.map((value, index) => { const Icon = icons[index]; return <label key={value} className={`category-option ${category === value ? 'selected' : ''}`}>
        <input type="radio" id={`category-${index}`} name="category" value={value} checked={category === value} onChange={() => { setCategory(value); setErrors(s => ({ ...s, category: '' })); }} />
        <Icon size={23} strokeWidth={1.5} aria-hidden="true" /><span>{t(`categories.${value}`)}</span>{category === value && <Check className="category-check" size={13} aria-hidden="true" />}
      </label>; })}</div>{errors.category && <p id="category-error" className="field-error" role="alert">{errors.category}</p>}
    </fieldset>
    <fieldset className="form-section"><legend className="form-section-title"><span className="step-number">03</span>{t('onboarding.languageLabel')}</legend>
      <div className="language-options">{languages.map(language => <label key={language} lang={language} className={i18n.language === language ? 'selected' : ''}>
        <input type="radio" name="preferredLanguage" value={language} checked={i18n.language === language} onChange={() => changeLanguage(language)} />
        <span>{languageNames[language]}</span>{i18n.language === language && <Check size={16} aria-hidden="true" />}
      </label>)}</div>
    </fieldset>
    <Button type="submit" disabled={saving} className="form-submit">{saving ? <LoaderCircle className="loading-icon" size={18} aria-hidden="true" /> : null}{t(saving ? 'common.saving' : editing ? 'common.save' : 'onboarding.continue')}<ArrowRight size={18} aria-hidden="true" /></Button>
    <p className="form-privacy"><LockKeyhole size={14} aria-hidden="true" />{t(editing ? 'settings.privacy' : 'onboarding.privacyText')}</p>
  </form>;
}
