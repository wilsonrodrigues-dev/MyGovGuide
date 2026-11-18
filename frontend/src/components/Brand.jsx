import { BookOpen, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../context/ProfileContext.jsx';
export function Brand() {
  const { t } = useTranslation(); const { profile } = useProfile();
  return <Link to={profile ? '/home' : '/onboarding'} className="brand" aria-label="MyGovGuide">
    <span className="brand-mark" aria-hidden="true"><BookOpen size={24} strokeWidth={1.6} /><span><Leaf size={11} /></span></span>
    <span><strong>MyGov<span>Guide</span></strong><small>{t('tagline')}</small></span>
  </Link>;
}
