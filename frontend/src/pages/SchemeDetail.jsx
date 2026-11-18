import {useEffect,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {api} from '../lib/api.js';
import {Button} from '../components/ui/button.jsx';
import {ReadAloud} from '../components/ReadAloud.jsx';
export function SchemeDetail(){
 const {id}=useParams(),{t,i18n}=useTranslation(),[attempt,setAttempt]=useState(0),[state,setState]=useState({loading:true});
 useEffect(()=>{const controller=new AbortController();setState({loading:true});api.get('/content/schemes/'+encodeURIComponent(id),{params:{language:i18n.language},signal:controller.signal}).then(({data})=>setState({data})).catch(e=>{if(e.code!=='ERR_CANCELED')setState({missing:e.response?.status===404,error:true});});return()=>controller.abort();},[id,i18n.language,attempt]);
 const date=v=>v&&!Number.isNaN(new Date(v).valueOf())?new Intl.DateTimeFormat({en:'en-IN',hi:'hi-IN',kn:'kn-IN'}[i18n.language]).format(new Date(v)):t('schemes.unknownDate');
 if(state.loading)return <div className="container scheme-page" role="status">{t('common.loading')}</div>;
 if(state.error)return <div className="container scheme-page"><h1>{t(state.missing?'schemes.unavailable':'schemes.error')}</h1><p>{t('schemes.unavailableHelp')}</p>{!state.missing&&<Button onClick={()=>setAttempt(n=>n+1)}>{t('common.retry')}</Button>}<p><Link to="/schemes">{t('schemes.back')}</Link></p></div>;
 const d=state.data,o=d.explanation;
 return <article className="container scheme-page scheme-detail"><Link to="/schemes">{t('schemes.back')}</Link><header><p className="eyebrow">{t('common.reviewed')}</p><h1 lang={d.language}>{o.title}</h1>{d.translationUnavailable&&<p className="scheme-caution" role="note">{t('schemes.fallback')}</p>}<p className="lead" lang={d.language}>{o.summary}</p><p>{t('schemes.reviewed')}</p>{!d.translationUnavailable&&<ReadAloud text={o.title+'. '+o.summary}/>}</header>
 <section><h2>{t('schemes.benefits')}</h2><ul lang={d.language}>{o.benefits.map((b,i)=><li key={i}>{b}</li>)}</ul></section>
 <section><h2>{t('schemes.eligibility')}</h2><h3>{t('schemes.audience')}</h3><p lang={d.language}>{o.whoItMayHelp}</p><p className="scheme-caution">{t('schemes.noVerdict')}</p></section>
 <section><h2>{t('schemes.documents')}</h2>{o.documents.length?<ul lang={d.language}>{o.documents.map((doc,i)=><li key={i}><strong>{doc.label}</strong>: {doc.explanation}</li>)}</ul>:<p>{t('schemes.noDocuments')}</p>}</section>
 <section><h2>{t('schemes.apply')}</h2><ol lang={d.language}>{o.howToApply.steps.map((s,i)=><li key={i}>{s}</li>)}</ol><p>{t('schemes.leaving')}</p><ul lang={d.language}>{o.howToApply.links.map(l=><li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a></li>)}</ul></section>
 <section className="scheme-caution"><h2>{t('schemes.limitations')}</h2><ul lang={d.language}>{o.limitations.map((l,i)=><li key={i}>{l}</li>)}</ul></section>
 <section><h2>{t('schemes.source')}</h2><a href={d.source.url} target="_blank" rel="noopener noreferrer">{t('common.source')} ↗</a><blockquote>{d.source.excerpt}</blockquote><dl>{d.scheme?.authority&&<><dt>{t('schemes.authority')}</dt><dd>{d.scheme.authority}</dd></>}<dt>{t('schemes.verified')}</dt><dd>{date(d.source.verifiedAt)}</dd><dt>{t('schemes.published')}</dt><dd>{date(d.source.publishedAt)}</dd></dl></section></article>;
}
