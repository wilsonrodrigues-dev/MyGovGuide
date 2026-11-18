import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, House, Compass, Bookmark, UserRound, ShieldCheck, LoaderCircle } from 'lucide-react';
import { Brand } from './Brand.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';
import { Button } from './ui/button.jsx';
import { useProfile } from '../context/ProfileContext.jsx';
const bottom = [['/home', House, 'home'], ['/schemes', Compass, 'explore'], ['/bookmarks', Bookmark, 'bookmarks'], ['/settings', UserRound, 'profile']];
export function Loading() {
  const { t } = useTranslation();
  return <div className="loading-state" role="status"><LoaderCircle className="loading-icon" aria-hidden="true" /><p>{t('common.loading')}</p></div>;
}
export function SyncNotice() {
  const { syncStatus, profile, saveProfile } = useProfile(); const { t } = useTranslation();
  if (!['offline', 'storage', 'serviceOffline', 'memoryOnly'].includes(syncStatus)) return null;
  const key = { offline: 'common.offline', storage: 'common.deviceOnly', serviceOffline: 'common.serviceOffline', memoryOnly: 'common.memoryOnly' }[syncStatus];
  return <div className="sync-notice" role="status"><span>{t(key)}</span>
    {profile && syncStatus !== 'storage' && <button type="button" onClick={() => saveProfile(profile)}>{t('common.retry')}</button>}
  </div>;
}
export function Layout() {
  const { t } = useTranslation(); const { profile, booting } = useProfile(); const location = useLocation();
  const onBoard = location.pathname === '/onboarding';
  useEffect(() => { window.scrollTo(0, 0); document.getElementById('main-content')?.focus({ preventScroll: true }); }, [location.pathname]);
  return <>
    <a className="skip-link" href="#main-content">{t('common.skip')}</a>
    <div className="trust-strip"><div className="container"><span><span className="tiny-square" />{t('independent')}</span><span className="trust-language">EN · हिन्दी · ಕನ್ನಡ</span></div></div>
    <header className="site-header"><div className="container header-inner"><Brand />
      {!onBoard && profile && <nav className="desktop-nav" aria-label={t('common.search')}><NavLink to="/home">{t('nav.home')}</NavLink><NavLink to="/schemes">{t('nav.explore')}</NavLink><NavLink to="/how-it-works">{t('nav.how')}</NavLink></nav>}
      <div className="header-tools"><LanguageSwitcher />{profile && !onBoard && <><Button asChild variant="ghost" size="icon"><Link to="/notifications" aria-label={t('nav.notifications')}><Bell size={20} aria-hidden="true" /></Link></Button>
        <Button asChild variant="outline" className="header-profile"><Link to="/settings"><UserRound size={17} aria-hidden="true" /><span>{t('nav.profile')}</span></Link></Button></>}</div>
    </div></header>
    <SyncNotice />
    <main id="main-content" tabIndex={-1}>{booting ? <Loading /> : <Outlet />}</main>
    <footer className={`site-footer ${profile && !onBoard ? 'with-bottom-nav' : ''}`}><div className="container"><span><ShieldCheck size={16} aria-hidden="true" />{t('common.privacy')}</span><small>© {new Date().getFullYear()} MyGovGuide · {t('common.notGovernment')}</small></div></footer>
    {profile && !onBoard && <nav className="bottom-nav" aria-label={t('nav.home')}>{bottom.map(([to, Icon, key]) => <NavLink key={to} to={to}><Icon size={21} aria-hidden="true" /><span>{t(`nav.${key}`)}</span></NavLink>)}</nav>}
  </>;
}
