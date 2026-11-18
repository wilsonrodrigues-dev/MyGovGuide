import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Languages, ShieldCheck } from 'lucide-react';
import { PreferenceForm } from '../components/PreferenceForm.jsx';
import { useProfile } from '../context/ProfileContext.jsx';
import { ReadAloud } from '../components/ReadAloud.jsx';
export function Onboarding() {
  const { t } = useTranslation(); const navigate = useNavigate(); const { profile } = useProfile();
  if (profile) return <Navigate to="/home" replace />;
  return <div className="container onboarding-layout">
    <section className="onboarding-story"><p className="eyebrow">{t('onboarding.eyebrow')}</p><h1>{t('onboarding.title')}</h1><p className="lead">{t('onboarding.subtitle')}</p>
      <div className="journey-visual" aria-hidden="true"><div className="journey-line" /><span className="journey-node first"><MapPin size={27} /></span><span className="journey-node second"><Users size={27} /></span><span className="journey-node third"><Languages size={27} /></span><div className="journey-caption"><span>{t('common.state')}</span><span>{t('common.category')}</span><span>{t('common.language')}</span></div></div>
      <div className="onboarding-note"><ShieldCheck size={24} aria-hidden="true" /><div><h2>{t('onboarding.trustTitle')}</h2><p>{t('onboarding.trustText')}</p></div></div>
      <ReadAloud text={`${t('onboarding.title')} ${t('onboarding.subtitle')} ${t('onboarding.privacyText')}`} />
    </section>
    <section className="onboarding-form-card" aria-labelledby="onboarding-form-title"><p className="eyebrow">{t('onboarding.step')}</p><h2 id="onboarding-form-title">{t('onboarding.formTitle')}</h2><p className="muted form-intro">{t('onboarding.formSubtitle')}</p><PreferenceForm onSaved={() => navigate('/home', { replace: true })} /></section>
  </div>;
}
