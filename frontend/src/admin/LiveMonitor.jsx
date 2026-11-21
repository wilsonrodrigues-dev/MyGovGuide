import { useEffect, useState,useRef } from 'react';
import { io } from 'socket.io-client';
import { adminApi, errorText } from './api.js';

const date = (value) => value ? new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium' }) : 'Not yet';

function summary(event) {
  const payload = event.payload || {};
  const job = payload.job || {};
  if (job.sourceId) return [job.sourceId, job.mode, job.state, job.progress].filter(Boolean).join(' · ');
  if (payload.progress) return `${payload.jobId || 'Job'} · ${payload.progress}`;
  return payload.reason || payload.message || 'Operational event';
}

export function LiveMonitor() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState('');
  const [historyError, setHistoryError] = useState('');
  const [reloading, setReloading] = useState(false);
  const [sources,setSources]=useState([]),[sourceId,setSourceId]=useState(''),[job,setJob]=useState(null),[jobs,setJobs]=useState([]),[busy,setBusy]=useState(false),[recordLimit,setRecordLimit]=useState(3),cursor=useRef(0);
  const merge=items=>{for(const e of items)cursor.current=Math.max(cursor.current,e.sequence||0);setEvents(old=>[...new Map([...items,...old].map(e=>[e.id,e])).values()].sort((a,b)=>(b.sequence||0)-(a.sequence||0)).slice(0,100));};
  async function start(id=sourceId){setBusy(true);try{const r=await adminApi.post('/jobs',{sourceId:id,mode:'LIVE',maxRecords:Number(recordLimit)});setJob(r.data);setJobs(old=>[r.data,...old].slice(0,50));setError('');}catch(e){setError(errorText(e));}finally{setBusy(false);}}

  async function replayAfter(after){for(let page=0;page<10;page++){const r=await adminApi.get('/events',{params:{afterSequence:after,limit:100}}),items=r.data.items||[];merge(items);if(items.length<100)return;after=items.at(-1).sequence;}setHistoryError('Replay window reached. Select an execution to inspect its complete bounded log.');}
  async function loadHistory() {
    setReloading(true);
    try {
      const { data } = await adminApi.get('/events', { params: { limit: 50 } });
      merge(data.items || []);
      setHistoryError('');
    } catch (e) {
      setHistoryError(errorText(e));
    } finally {
      setReloading(false);
    }
  }

  useEffect(() => {
    let active = true;
    loadHistory();
    adminApi.get('/jobs',{params:{limit:50}}).then(r=>{if(active)setJobs(r.data.items||[]);}).catch(e=>setHistoryError(errorText(e)));
    adminApi.get('/sources').then(r=>{if(active)setSources(r.data.items.filter(s=>s.config?.enabled&&s.authorizationStatus==='APPROVED'));}).catch(e=>setError(errorText(e)));
    const socket = io({ path: '/api/admin/realtime', withCredentials: true, transports: ['websocket', 'polling'] });
    socket.on('connect', () => { if (active) { setStatus('live'); setError('');replayAfter(cursor.current).catch(e=>setHistoryError(errorText(e))); } });
    socket.on('disconnect', () => { if (active) setStatus('offline'); });
    socket.on('connect_error', (e) => { if (active) { setStatus('offline'); setError(e.message || 'Live connection unavailable'); } });
    socket.on('admin:event', (event) => {
      if (!active) return;
      merge([event]);if(event.payload?.job)setJob(old=>old?._id===event.payload.job._id?event.payload.job:old);
    });
    return () => { active = false; socket.disconnect(); };
  }, []);

  return (
    <section className="ad-panel" aria-label="Live operations monitor">
      <div className="ad-panel-heading">
        <h2>Live monitor</h2>
        <span className={`ad-badge ${status === 'live' ? 'ad-good' : status === 'offline' ? 'ad-warn' : ''}`}>{status.toUpperCase()}</span>
      </div>
      <p className="ad-muted">Authenticated worker events stream live. Reload history and execution selection replay recorded events; replay never performs a new fetch.</p>
      <form onSubmit={e=>{e.preventDefault();start();}}><label>Authorized source<select aria-label="Authorized source" value={sourceId} onChange={e=>setSourceId(e.target.value)}><option value="">Select a source</option>{sources.map(s=><option key={s.id} value={s.id}>{s.title} — {s.approval?.approvalExpiry||'Expiry not recorded'}</option>)}</select></label><label>Record limit<input aria-label="Record limit" type="number" min="1" max="3" value={recordLimit} onChange={e=>setRecordLimit(e.target.value)}/></label><button disabled={busy||!sourceId||!Number.isInteger(Number(recordLimit))||Number(recordLimit)<1||Number(recordLimit)>3} type="submit">Start Collection</button></form>
      <label>Recent execution<select aria-label="Recent execution" value={job?._id||''} onChange={async e=>{const selected=jobs.find(j=>j._id===e.target.value);setJob(selected||null);if(selected)try{const r=await adminApi.get('/events',{params:{runId:selected._id,limit:100}});setEvents(r.data.items||[]);}catch(error){setHistoryError(errorText(error));}}}><option value="">Select an execution</option>{jobs.map(j=><option key={j._id} value={j._id}>{j.sourceId} · {j.mode} · {j.state} · {j._id}</option>)}</select></label>
      {sourceId&&<p>Permission: APPROVED; expiry {date(sources.find(s=>s.id===sourceId)?.approval?.approvalExpiry)}. Runtime checks run again before fetch and commit.</p>}{job&&<p>Run {job._id} · {job.state} <button disabled={!['RUNNING','QUEUED'].includes(job.state)} onClick={async()=>{try{const r=await adminApi.post('/jobs/'+job._id+'/cancel');setJob(r.data);}catch(e){setError(errorText(e));}}}>Stop at safe boundary</button> <button disabled={busy||job.mode!=='LIVE'||!['FAILED','INTERRUPTED','CANCELLED','BLOCKED'].includes(job.state)} onClick={()=>start(job.sourceId)}>Retry as new run</button> <button onClick={async()=>{try{const r=await adminApi.get('/jobs/'+job._id+'/summary');const url=URL.createObjectURL(new Blob([JSON.stringify(r.data,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='collection-'+job._id+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){setError(errorText(e));}}}>Export run summary</button></p>}
      {(error || historyError) && <p role="alert" className="ad-error">{error || historyError}</p>}
      <div className="ad-actions">
        <button disabled={reloading} onClick={loadHistory}>{reloading ? 'Reloading…' : 'Reload history'}</button>
        <button onClick={() => setEvents([])}>Clear view</button>
      </div>
      {events.length ? (
        <div className="ad-table-wrap">
          <table>
            <caption className="ad-sr-only">Recent live administrative events</caption>
            <thead><tr><th>Event</th><th>When (IST)</th><th>Details</th></tr></thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td><code>{event.type}</code><small>#{event.sequence||'ephemeral'} · {event.runId||'operations'}</small></td>
                  <td>{date(event.at)}</td>
                  <td>
                    {summary(event)}{event.payload?.sourceUrl&&<p><a href={event.payload.sourceUrl} target="_blank" rel="noreferrer">{event.payload.sourceUrl}</a></p>}{event.payload?.httpStatus&&<p>HTTP {event.payload.httpStatus} ? {event.payload.responseTimeMs??"not recorded"} ms</p>}{event.payload?.parsedRecords!==undefined&&<p>{event.payload.parsedRecords} parsed; commit cap {job?.maxRecords||recordLimit}. Publication requires separate review.</p>}
                    <details><summary>Payload</summary><pre className="ad-json">{JSON.stringify(event.payload, null, 2)}</pre></details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="ad-empty">No live events yet. Start a collection job to see progress here.</p>}
    </section>
  );
}
