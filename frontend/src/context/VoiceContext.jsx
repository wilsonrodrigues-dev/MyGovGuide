import {createContext,useContext,useEffect,useRef,useState,useCallback,useId} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useProfile} from './ProfileContext.jsx';
import {resolveVoiceCommand,resultSignature} from '../lib/voiceCommands.js';
const Context=createContext(null),locale={en:'en-IN',hi:'hi-IN',kn:'kn-IN'};
export function VoiceProvider({children}){
 const {t,i18n}=useTranslation(),{changeLanguage}=useProfile(),navigate=useNavigate(),location=useLocation();
 const [enabled,setEnabled]=useState(()=>{try{return localStorage.getItem('mygovguide.voice.v1')==='true';}catch{return false;}}),[open,setOpen]=useState(false),[listening,setListening]=useState(false),[speaking,setSpeaking]=useState(false),[transcript,setTranscript]=useState(''),[message,setMessage]=useState(''),[pending,setPending]=useState(null);
 const page=useRef({}),recognizer=useRef(null),speakingRef=useRef(false),generation=useRef(0),executeRef=useRef(null);
 const contexts=useRef(new Map());const registerPage=useCallback((key,value)=>{const update=()=>{page.current=[...contexts.current.values()].sort((a,b)=>(b.priority||0)-(a.priority||0))[0]||{};};if(value)contexts.current.set(key,value);update();return()=>{contexts.current.delete(key);update();};},[]);
 const recognitionSupported=Boolean(window.SpeechRecognition||window.webkitSpeechRecognition),speechSupported=Boolean(window.speechSynthesis);
 function enable(){setEnabled(true);setOpen(true);try{localStorage.setItem('mygovguide.voice.v1','true');}catch{/* optional setting stays in memory */}}
 function stop(){generation.current++;recognizer.current?.abort();recognizer.current=null;setListening(false);window.speechSynthesis?.cancel();speakingRef.current=false;setSpeaking(false);}
 function disable(){stop();setEnabled(false);setPending(null);setMessage('');setTranscript('');try{localStorage.setItem('mygovguide.voice.v1','false');}catch{/* in-memory fallback */}}
 function speak(text,language=i18n.language){stop();if(!speechSupported){setMessage(t('citizen.speechUnavailable'));return;}const voices=window.speechSynthesis.getVoices(),voice=voices.find(v=>v.lang.toLowerCase().startsWith(language));if(language!=='en'&&!voice){setMessage(t('citizen.languageVoiceUnavailable'));return;}const utterance=new SpeechSynthesisUtterance(text.slice(0,8000)),speechGeneration=generation.current;utterance.lang=locale[language];if(voice)utterance.voice=voice;utterance.onend=utterance.onerror=()=>{if(speechGeneration===generation.current){speakingRef.current=false;setSpeaking(false);}};speakingRef.current=true;setSpeaking(true);window.speechSynthesis.speak(utterance);}
 function execute(command){setPending(null);setMessage('');switch(command.action){
  case'change_language':stop();changeLanguage(command.language);page.current.onLanguageSelected?.();break;
  case'navigate':stop();navigate(command.path);break;
  case'search':if(page.current.search){page.current.search(command.query);break;}stop();navigate('/schemes?'+new URLSearchParams({q:command.query,...(command.category?{category:command.category}:{})}));break;
  case'open_form':stop();navigate('/forms/'+encodeURIComponent(command.id));break;
  case'read_field':{const field=page.current.fields?.find(f=>f.id===command.id);if(field){page.current.selectField?.(field.id);speak(field.text,field.language);}else setMessage(t('citizen.sectionUnavailable'));break;}
  case'select_field':page.current.selectField?.(command.id);break;
  case'next_field':page.current.moveField?.(1);break;
  case'read_next_action':page.current.readNextAction?.();break;
  case'previous_field':page.current.moveField?.(-1);break;
  case'explain_field':case'repeat_field':page.current.explainSelected?.();break;
  case'open_scheme':stop();navigate('/schemes/'+encodeURIComponent(command.id));break;
  case'set_onboarding_field':if(page.current.setField){page.current.setField(command.field,command.value);setMessage(t('citizen.fieldUpdated'));}else setMessage(t('citizen.onboardingOnly'));break;
  case'read_section':{const section=page.current.sections?.[command.section];if(section)speak(section.text,section.language);else setMessage(t('citizen.sectionUnavailable'));break;}
  case'stop_readback':stop();break;
  case'disable_voice':disable();break;
  default:setMessage(t('citizen.commandUnknown'));
 }}
 function command(text){setTranscript(text.slice(0,240));const action=resolveVoiceCommand(text,page.current);if(!action){setPending(null);setMessage(t('citizen.commandUnknown'));return;}if(action.confirm){setPending({...action,signature:resultSignature(page.current.results||[]),path:location.pathname+location.search});return;}execute(action);}
 executeRef.current=command;
 function listen(){enable();stop();if(!recognitionSupported){setMessage(t('voice.unsupported'));return;}const Constructor=window.SpeechRecognition||window.webkitSpeechRecognition,instance=new Constructor(),current=++generation.current;recognizer.current=instance;instance.lang=locale[i18n.language];instance.continuous=false;instance.interimResults=false;instance.maxAlternatives=1;instance.onstart=()=>{if(current===generation.current){setListening(true);setMessage('');}};instance.onend=()=>{if(current===generation.current)setListening(false);};instance.onerror=()=>{if(current===generation.current){setListening(false);setMessage(t('voice.denied'));}};instance.onresult=e=>{if(current===generation.current){setListening(false);executeRef.current(e.results[0][0].transcript);}};try{instance.start();}catch{setMessage(t('voice.denied'));}}
 function confirm(value){if(!pending)return;if(pending.path!==location.pathname+location.search||pending.signature!==resultSignature(page.current.results||[])){setPending(null);setMessage(t('citizen.resultsChanged'));return;}if(['open_scheme','open_form'].includes(pending.action)){const selected=pending.choices.find(r=>r.id===value);if(selected)execute({action:pending.action,id:selected.id});}else execute({...pending,value:value||pending.value});}
 useEffect(()=>{stop();setPending(null);setMessage('');},[location.pathname,location.search,i18n.language]);
 useEffect(()=>()=>{recognizer.current?.abort();window.speechSynthesis?.cancel();},[]);
 return <Context.Provider value={{enabled,open,setOpen,enable,disable,stop,speak,listen,command,confirm,pending,setPending,listening,speaking,transcript,message,recognitionSupported,speechSupported,page,registerPage}}>{children}</Context.Provider>;
}
export const useAssistant=()=>useContext(Context);
export function usePageVoice(value){const context=useAssistant(),key=useId();useEffect(()=>context?.registerPage?.(key,value),[context?.registerPage,key,value]);}
