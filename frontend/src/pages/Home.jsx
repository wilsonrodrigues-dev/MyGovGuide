import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Mic, ArrowUpRight, ArrowRight, MapPin, UserRound, Compass, ClipboardCheck, FileText, ShieldCheck, Files, BookOpen, Check, ExternalLink } from 'lucide-react';
import { useProfile } from '../context/ProfileContext.jsx';
import { stateName } from '../data/options.js';
import { Button } from '../components/ui/button.jsx';
import { useVoice } from '../hooks/useVoice.js';
import { api } from '../lib/api.js';
const actions = [['schemes', '/schemes', Compass], ['eligibility', '/eligibility', ClipboardCheck], ['notices', '/notice', FileText], ['scams', '/alerts', ShieldCheck], ['forms', '/forms', Files]];
export function Home() {
  const { t, i18n } = useTranslation(); const { profile, syncStatus } = useProfile(); const navigate = useNavigate();
  const [query, setQuery] = useState(''); const voice = useVoice(setQuery);
  const [previews, setPreviews] = useState({ loading: true, error: false, items: [] }); const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (syncStatus === 'saving' || syncStatus === 'loading') { setPreviews({ loading: true, error: false, items: [] }); return; }
    const controller = new AbortController();
    setPreviews({ loading: true, error: false, items: [] });
    api.get('/schemes/preview', { signal: controller.signal }).then(({ data }) => {
      if (!Array.isArray(data.items) || data.matching?.state !== profile.state || data.matching?.category !== profile.category) throw new Error('Preview profile does not match current preferences');
      setPreviews({ loading: false, error: false, items: data.items });
    })
      .catch(error => { if (error.code !== 'ERR_CANCELED') setPreviews({ loading: false, error: true, items: [] }); });
    return () => controller.abort();
  }, [profile.state, profile.category, profile.language, syncStatus, attempt]);
  function search(event) { event.preventDefault(); navigate(`/schemes${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`); }
  return <div className="container home-page">
    <section className="home-hero"><div><p className="eyebrow">{t('home.eyebrow')}</p><h1>{t('home.title')}<br /><em>{t('home.titleAccent')}</em></h1><p className="lead">{t('home.subtitle')}</p></div>
      <aside className="profile-summary"><span className="profile-avatar" aria-hidden="true"><UserRound size={25} /></span><p className="profile-welcome">{t('home.welcome')}</p><p className="eyebrow">{t('home.profileCaption')}</p><div className="profile-meta"><span><MapPin size={14} aria-hidden="true" />{stateName(profile.state, i18n.language)}</span><span>{t(`categories.${profile.category}`)}</span></div><Link to="/settings">{t('common.edit')} <ArrowUpRight size={14} aria-hidden="true" /></Link></aside>
    </section>
    <section className="search-section" aria-label={t('home.searchLabel')}><form className="home-search" onSubmit={search}><Search size={22} aria-hidden="true" /><label htmlFor="home-search" className="sr-only">{t('home.searchLabel')}</label><input id="home-search" value={query} maxLength={120} onChange={event => setQuery(event.target.value)} placeholder={t('home.searchPlaceholder')} />
      <button type="button" className={`voice-button ${voice.listening ? 'listening' : ''}`} onClick={voice.start} aria-label={t(voice.listening ? 'voice.listening' : 'voice.start')} title={t(voice.supported ? 'voice.privacy' : 'voice.unsupported')}><Mic size={20} aria-hidden="true" /></button><Button type="submit" className="search-submit" aria-label={t('common.search')}><span>{t('common.search')}</span><ArrowRight size={18} aria-hidden="true" /></Button>
    </form><p className="search-hint" role="status">{voice.listening ? t('voice.listening') : voice.message || t('home.searchHint')}</p></section>
    <section aria-labelledby="actions-title" className="actions-section"><div className="section-heading"><div><h2 id="actions-title">{t('home.helpTitle')}</h2><p>{t('home.helpSubtitle')}</p></div><span className="section-rule" /></div>
      <div className="actions-grid">{actions.map(([key, to, Icon], index) => <Link to={to} key={key} className={`action-card ${index === 0 ? 'action-featured' : ''} ${index < 2 ? 'action-wide' : ''}`}>
        <div className="action-card-top"><span className="action-icon"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /></span><ArrowUpRight size={22} aria-hidden="true" /></div><div><h3>{t(`home.actions.${key}.title`)}</h3><p>{t(`home.actions.${key}.description`)}</p></div>{index === 0 && <span className="action-cta">{t('home.actions.schemes.label')} <ArrowRight size={17} aria-hidden="true" /></span>}
      </Link>)}</div>
    </section>
    <section className="journey-section"><div className="journey-results"><div className="section-heading"><div><h2>{t('home.selected')}</h2><p>{t('home.selectedHint')}</p></div></div>
      {previews.loading ? <div className="empty-panel skeleton-panel" role="status"><span className="skeleton-line" /><span className="skeleton-line short" /><p>{t('common.loading')}</p></div> : previews.error ? <div className="empty-panel" role="status"><BookOpen size={30} aria-hidden="true" /><h3>{t('common.unavailable')}</h3><Button variant="outline" onClick={() => setAttempt(a => a + 1)}>{t('common.retry')}</Button></div> : previews.items.length ? <div className="scheme-previews">{previews.items.map(scheme => <article className="scheme-preview" key={scheme.id}><span className="source-badge"><ShieldCheck size={13} aria-hidden="true" />{t('common.reviewed')}</span><h3><Link to={'/schemes/'+encodeURIComponent(scheme.id)}>{scheme.title}</Link></h3>{scheme.translationUnavailable&&<p role="note">{t('common.translationUnavailable')}</p>}<p>{stateName(scheme.state, i18n.language)}</p><small>{new Intl.DateTimeFormat({ en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN' }[i18n.language]).format(new Date(scheme.reviewedAt))}</small><a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer">{t('common.source')} <ExternalLink size={14} aria-hidden="true" /></a></article>)}</div> : <div className="empty-panel"><span className="empty-symbol" aria-hidden="true"><BookOpen size={30} strokeWidth={1.3} /></span><p className="eyebrow">{t('home.emptyLabel')}</p><h3>{t('home.emptyTitle')}</h3><p>{t('home.emptyText')}</p></div>}
      <p className="source-footnote"><ShieldCheck size={14} aria-hidden="true" />{t('home.sourceFooter')}</p></div>
      <aside className="transparency-panel"><p className="eyebrow">{t('home.transparencyEyebrow')}</p><h2>{t('home.transparencyTitle')}</h2><p>{t('home.transparencyText')}</p><ul>{['sourcePoint', 'reviewPoint', 'rulesPoint'].map(key => <li key={key}><Check size={16} aria-hidden="true" />{t(`home.${key}`)}</li>)}</ul><Link to="/how-it-works">{t('home.trustLink')}<ArrowUpRight size={17} aria-hidden="true" /></Link></aside>
    </section>
  </div>;
}
