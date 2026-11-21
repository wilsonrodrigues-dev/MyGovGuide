import {Volume2,Square} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {useAssistant} from '../context/VoiceContext.jsx';
export function ReadAloud({text,language}){const {t,i18n}=useTranslation(),voice=useAssistant();return <button className="read-aloud" type="button" onClick={()=>voice.speaking?voice.stop():voice.speak(text,language||i18n.language)} disabled={!voice.speechSupported} title={!voice.speechSupported?t('voice.unavailable'):undefined}>{voice.speaking?<Square size={16}/>:<Volume2 size={18}/>} {t(voice.speaking?'voice.stop':'voice.read')}</button>;}
