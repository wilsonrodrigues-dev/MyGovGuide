import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {useLocation} from 'react-router-dom';
import i18n from '../i18n/index.js';
import { bootstrap, persistProfile } from '../lib/api.js';
import { isProfile, languages } from '../data/options.js';
import { readPreferences, writePreferences } from '../lib/preferences.js';
const ProfileContext = createContext(null);
function cached() { try { return readPreferences(window.localStorage); } catch { return null; } }
function cache(profile, pending) { try { return writePreferences(window.localStorage, profile, pending); } catch { return false; } }
export function ProfileProvider({ children }) {
  const location=useLocation(),privateRoute=/^\/(?:notices?|eligibility)(?:\/|$)/.test(location.pathname);
  const [profile, setProfile] = useState(() => cached()?.profile || null);
  const [booting, setBooting] = useState(true);
  const [syncStatus, setSyncStatus] = useState('loading');
  const sequence = useRef(0); const saves = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    if(privateRoute){setBooting(false);setSyncStatus('private');return()=>{active=false;};}
    (async () => {
      const local = cached();
      try {
        const server = await bootstrap();
        const desired = local?.pending || (!server.profile && local?.profile) ? local?.profile : server.profile;
        if (desired && isProfile(desired)) {
          if (local?.pending || !server.profile) await persistProfile(desired);
          if (active) { setProfile(desired); i18n.changeLanguage(desired.language); setSyncStatus(cache(desired, false) ? 'synced' : 'storage'); }
        } else if (active) { setProfile(null); setSyncStatus('synced'); }
      } catch { if (active) setSyncStatus(local?.profile ? 'offline' : 'serviceOffline'); }
      finally { if (active) setBooting(false); }
    })();
    return () => { active = false; };
  }, [privateRoute]);
  async function saveProfile(next) {
    if (!isProfile(next)) throw new Error('Invalid preferences');
    const current = ++sequence.current;
    setProfile(next); i18n.changeLanguage(next.language); const localSaved = cache(next, true); setSyncStatus('saving');
    const job = saves.current.catch(() => {}).then(async () => {
      try {
        await persistProfile(next);
        if (current === sequence.current) setSyncStatus(cache(next, false) ? 'synced' : 'storage');
        return true;
      } catch {
        if (current === sequence.current) setSyncStatus(localSaved ? 'offline' : 'memoryOnly');
        return false;
      }
    });
    saves.current = job; return job;
  }
  async function changeLanguage(language) {
    if (!languages.includes(language)) return;
    i18n.changeLanguage(language);
    try { localStorage.setItem('mygovguide.language', language); } catch { /* language still works for this visit */ }
    if (profile && !privateRoute) await saveProfile({ ...profile, language });
  }
  return <ProfileContext.Provider value={{ profile, booting, syncStatus, saveProfile, changeLanguage }}>{children}</ProfileContext.Provider>;
}
export const useProfile = () => useContext(ProfileContext);
