import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
export function useVoice(onResult) {
  const { t, i18n } = useTranslation(); const recognition = useRef(null);
  const [listening, setListening] = useState(false); const [message, setMessage] = useState('');
  const supported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  useEffect(() => () => recognition.current?.abort(), []);
  function start() {
    if (!supported) { setMessage(t('voice.unsupported')); return; }
    if (listening) { recognition.current?.stop(); return; }
    const Constructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const instance = new Constructor(); recognition.current = instance;
    instance.lang = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN' }[i18n.language];
    instance.interimResults = false; instance.maxAlternatives = 1;
    instance.onstart = () => { setListening(true); setMessage(''); };
    instance.onend = () => setListening(false);
    instance.onerror = () => { setListening(false); setMessage(t('voice.denied')); };
    instance.onresult = event => { onResult(event.results[0][0].transcript); setListening(false); };
    try { instance.start(); } catch { setMessage(t('voice.denied')); }
  }
  return { start, listening, message, supported };
}
