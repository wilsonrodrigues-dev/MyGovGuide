import { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export function ReadAloud({ text }) {
  const { t, i18n } = useTranslation(); const [speaking, setSpeaking] = useState(false);
  const available = 'speechSynthesis' in window;
  useEffect(() => () => { if (available) window.speechSynthesis.cancel(); }, [available]);
  function toggle() {
    if (!available) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN' }[i18n.language];
    utterance.onend = () => setSpeaking(false); utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance); setSpeaking(true);
  }
  return <button className="read-aloud" type="button" onClick={toggle} disabled={!available} title={!available ? t('voice.unavailable') : undefined}>
    {speaking ? <Square size={16} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}{t(speaking ? 'voice.stop' : 'voice.read')}
  </button>;
}
