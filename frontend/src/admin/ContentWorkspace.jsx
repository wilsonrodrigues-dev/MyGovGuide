import { useEffect, useState, useCallback } from "react";
import {
  Sparkles,
  Languages,
  ShieldCheck,
  RefreshCw,
  FileCheck2,
  AlertCircle,
} from "lucide-react";
import { adminApi as api, errorText } from "./api.js";
import {BatchPreparation} from './BatchPreparation.jsx';
function Pill({ children }) {
  return <span className="ad-badge">{children}</span>;
}
function SourceJson({ value }) {
  return <pre className="ad-json">{JSON.stringify(value, null, 2)}</pre>;
}
export function PipelineStatus() {
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/content/metrics")
      .then((r) => setData(r.data))
      .catch((e) => setError(errorText(e)));
  }, []);
  if (error)
    return (
      <p role="alert" className="ad-error">
        {error}
      </p>
    );
  if (!data) return null;
  return (
    <section
      className="ad-panel ad-pipeline"
      aria-label="Trusted content pipeline"
    >
      <div className="ad-panel-heading">
        <h2>
          <ShieldCheck size={18} /> Trusted content pipeline
        </h2>
        <Pill>Source → review → prepare → publish</Pill>
      </div>
      <div className="ad-metrics">
        <article>
          <span>Fact review snapshots</span>
          <strong>{data.approvals}</strong>
        </article>
        <article>
          <span>AI jobs awaiting work</span>
          <strong>
            {data.jobs
              .filter((x) =>
                ["QUEUED", "RUNNING", "DEFERRED"].includes(x._id.state),
              )
              .reduce((n, x) => n + x.count, 0)}
          </strong>
        </article>
        <article>
          <span>AI failed / blocked</span>
          <strong>
            {data.jobs
              .filter((x) => ["FAILED", "BLOCKED"].includes(x._id.state))
              .reduce((n, x) => n + x.count, 0)}
          </strong>
        </article>
        {["en", "hi", "kn"].map((language) => (
          <article key={language}>
            <span>{language.toUpperCase()} prepared summaries & keywords</span>
            <strong>
              {data.artifacts
                .filter(
                  (x) =>
                    x._id.language === language &&
                    !x._id.stale &&
                    ["REVIEW_PENDING", "APPROVED"].includes(x._id.state),
                )
                .reduce((n, x) => n + x.count, 0)}
            </strong>
            <small>Includes pending review · split by provenance below</small>
          </article>
        ))}
      </div>
      <p className="ad-muted">
        Publication is separate from preparation. Eligibility rules need their
        own review: {data.eligibilityRulesApproved} approved.
      </p>
      <div className="ad-actions">
        {data.approvalOrigins?.map((x) => (
          <Pill key={x._id}>
            {x._id} · {x.count} fact-review snapshots
          </Pill>
        ))}
        {data.jobs.map((x, i) => (
          <Pill key={i}>
            {x._id.dataClass} · {x._id.state} · {x.count} jobs
          </Pill>
        ))}
      </div>
      <div className="ad-table-wrap">
        <table>
          <caption>
            Stored record origins — publication and verification remain separate
          </caption>
          <thead>
            <tr>
              <th>Record type</th>
              <th>Origin</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {data.recordOrigins?.map((x, i) => (
              <tr key={i}>
                <td>{x.entityType}</td>
                <td>
                  <Pill>{x.origin}</Pill>
                </td>
                <td>{x.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ad-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Origin</th>
              <th>Language</th>
              <th>Review</th>
              <th>Stale?</th>
              <th>Artifacts</th>
              <th>Tokens in / out</th>
              <th>Reserved cost bound (USD)</th>
            </tr>
          </thead>
          <tbody>
            {data.artifacts.map((x, i) => (
              <tr key={i}>
                <td>
                  <Pill>{x._id.dataClass}</Pill>
                </td>
                <td>{x._id.language}</td>
                <td>{x._id.state}</td>
                <td>{x._id.stale ? "Yes" : "No"}</td>
                <td>{x.count}</td>
                <td>
                  {x.inputTokens} / {x.outputTokens}
                </td>
                <td>{Number(x.costBoundUsd || 0).toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!data.artifacts.length && (
        <p className="ad-empty">
          No AI-prepared content yet. Review source facts before queuing
          preparation.
        </p>
      )}
      <div className="ad-actions">
        {data.published.map((x, i) => (
          <Pill key={i}>
            {x._id.dataClass} · {x._id.language} · {x.count} published index
            records
          </Pill>
        ))}
      </div>
      <p className="ad-muted">
        Imported research, offline fixtures and authorized live collections
        remain separate modes in the collection timeline.
      </p>
    </section>
  );
}
export function ContentWorkspace({ reviewMode = false }) {
  const [schemes, setSchemes] = useState([]),
    [schemeId, setSchemeId] = useState(""),
    [detail, setDetail] = useState(null),
    [health, setHealth] = useState(null),
    [jobs, setJobs] = useState([]),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [selectedLanguages, setSelectedLanguages] = useState(["en", "hi", "kn"]);
  const [excerpt, setExcerpt] = useState(""),
    [clause, setClause] = useState(""),
    [rights, setRights] = useState(""),
    [evidence, setEvidence] = useState(""),
    [attested, setAttested] = useState(false),
    [until, setUntil] = useState(""),
    [artifact, setArtifact] = useState(null),
    [edited, setEdited] = useState(""),
    [reason, setReason] = useState(""),
    [publishReason, setPublishReason] = useState(""),
    [chosen, setChosen] = useState({}),
    [search, setSearch] = useState(""),
    [searchLanguage, setSearchLanguage] = useState("en"),
    [results, setResults] = useState(null);
  const [inspected,setInspected]=useState([]),[reviewSelection,setReviewSelection]=useState([]),[batchReason,setBatchReason]=useState(''),[batchAttested,setBatchAttested]=useState(false);
  const load = useCallback(async () => {
    try {
      const [s, h, j] = await Promise.all([
        api.get("/content/schemes?limit=100"),
        api.get("/content/providers"),
        api.get("/content/jobs?limit=30"),
      ]);
      setSchemes(s.data.items);
      setHealth(h.data);
      setJobs(j.data.items);
      if (schemeId) {
        const d = await api.get(
          `/content/schemes/${encodeURIComponent(schemeId)}`,
        );
        setDetail(d.data);
      }
      setError("");
    } catch (e) {
      setError(errorText(e));
    }
  }, [schemeId]);
  useEffect(() => {
    setDetail(null);
    setChosen({});
    setInspected([]);setReviewSelection([]);setBatchAttested(false);setBatchReason('');
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [load]);
  async function action(work, success) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await work();
      setMessage(success);
      await load();
      return true;
    } catch (e) {
      setError(errorText(e));
      return false;
    } finally {
      setBusy(false);
    }
  }
  const current = detail?.versions.find(
    (v) => v.id === detail.scheme.currentVersionId,
  );
  async function approve(e) {
    e.preventDefault();
    await action(
      () =>
        api.post(`/content/schemes/${schemeId}/fact-review`, {
          sourceVersionId: current.id,
          excerpt,
          clauseRefs: clause
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean),
          evidenceUrl: current.payload.sourceUrl,
          rightsBasis: rights,
          evidence,
          verifiedAt: new Date().toISOString(),
          validUntil: new Date(until).toISOString(),
          publicNonSensitive: attested,
          factsChecked: attested,
          rightsChecked: attested,
        }),
      "Source fact review recorded. Content is still internal.",
    );
  }
  async function review(actionName) {
    await action(async () => {
      await api.post(`/content/artifacts/${artifact._id}/review`, {
        action: actionName,
        evidence: reason,
        ...(actionName === "EDIT" ? { output: JSON.parse(edited) } : {}),
      });
      // Close this decision before refreshing the list. A later completion must
      // not close an editor the user has just opened from the refreshed cards.
      setArtifact(null);
    }, "Artifact decision recorded.");
  }
  async function reviewSelected(){
    if(!batchAttested||batchReason.trim().length<10||!reviewSelection.length)return;
    await action(async()=>{
      try{for(const id of reviewSelection){await api.post(`/content/artifacts/${id}/review`,{action:'APPROVE',evidence:batchReason});}}
      finally{setReviewSelection([]);setBatchAttested(false);await load();}
    },'Explicit selected-artifact editorial decisions recorded. Publication remains a separate action.');
  }
  return (
    <>
      <header className="ad-title">
        <div>
          <p className="ad-eyebrow">TRUSTED DATA → MULTILINGUAL CONTENT</p>
          <h1>
            {reviewMode ? "Review & publish" : "AI preparation workspace"}
          </h1>
        </div>
        <button onClick={load}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>
      <p className="ad-subtitle">
        Approved evidence first. AI proposes explanations and keywords; an
        editor decides what can be published.
      </p>
      {error && (
        <p role="alert" className="ad-error">
          {error}
        </p>
      )}
      <p role="status">{message}</p>
      {health && (
        <section className="ad-panel">
          <div className="ad-panel-heading">
            <h2>Provider readiness</h2>
            <Pill>Server-only credentials</Pill>
          </div>
          <div className="ad-columns">
            <div>
              <h3>Gemini</h3>
              <p>
                Primary key:{" "}
                {health.gemini.primaryConfigured ? "Configured" : "Missing"} ·
                model: {health.gemini.model || "Not selected"}
              </p>
              <p>
                <Pill>
                  {health.gemini.generationAllowed
                    ? "Entitlement configured"
                    : "Generation blocked: confirm free tier or approved spend"}
                </Pill>
              </p>
              <small>
                Two keys share project quota. A 429 never switches credentials.
              </small>
            </div>
            <div>
              <h3>Generation controls</h3>
              <p>Gemini only. Unavailable jobs wait for recovery.</p>
              <p>
                Daily budget: ${health.dailyBudgetUsd} · Paid use:{" "}
                {health.paidUseApproved
                  ? "Approved in private configuration"
                  : "Not approved"}
              </p>
              <small>
                No external calls occur while selecting or previewing content.
              </small>
            </div>
          </div>
          {health.states.length > 0 && <SourceJson value={health.states} />}
        </section>
      )}
      <BatchPreparation schemes={schemes} onComplete={load}/>
      <section className="ad-panel">
        <div className="ad-panel-heading">
          <h2>Choose a scheme</h2>
          <Pill>{schemes.length} loaded</Pill>
        </div>
        <label>
          Scheme for content preparation
          <select
            value={schemeId}
            onChange={(e) => {
              setSchemeId(e.target.value);
              setExcerpt("");
              setAttested(false);
              setArtifact(null);
            }}
          >
            <option value="">Select a research or reviewed scheme</option>
            {schemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} · {s.status}
              </option>
            ))}
          </select>
        </label>
        {!schemes.length && (
          <p className="ad-empty">
            No schemes have been imported into this database.
          </p>
        )}
      </section>
      {detail && (
        <>
          <section className="ad-panel">
            <div className="ad-panel-heading">
              <h2>Source evidence & canonical facts</h2>
              <Pill>
                {detail.scheme.status} · {detail.scheme.publicationStatus}
              </Pill>
            </div>
            <p>
              <a
                href={detail.scheme.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Original official source ↗
              </a>
            </p>
            <p className="ad-muted">
              Source version {current?.id}. Research and source excerpts remain
              separate from generated explanations.
            </p>
            <details>
              <summary>Inspect original record and parsed facts</summary>
              <SourceJson
                value={{
                  original: current?.original,
                  parsedFacts: current?.payload,
                }}
              />
            </details>
            {detail.approvals.length > 0 && (
              <details>
                <summary>Human review history</summary>
                <SourceJson value={detail.approvals} />
              </details>
            )}
            <details>
              <summary>Record a human fact review</summary>
              <form className="ad-form ad-content-form" onSubmit={approve}>
                <p>
                  Independently inspect the source, currentness and rights. This
                  approves facts for preparation, never eligibility rules or
                  automatic collection.
                </p>
                <label>
                  Exact reviewed official excerpt
                  <textarea
                    required
                    minLength={40}
                    maxLength={12000}
                    rows={5}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </label>
                <label>
                  Clause references (one per line)
                  <textarea
                    required
                    rows={2}
                    value={clause}
                    onChange={(e) => setClause(e.target.value)}
                  />
                </label>
                <label>
                  Reuse rights and restrictions
                  <input
                    required
                    minLength={10}
                    value={rights}
                    onChange={(e) => setRights(e.target.value)}
                  />
                </label>
                <label>
                  Review evidence and currentness notes
                  <textarea
                    required
                    minLength={10}
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                  />
                </label>
                <label>
                  Review valid until
                  <input
                    type="datetime-local"
                    required
                    value={until}
                    onChange={(e) => setUntil(e.target.value)}
                  />
                </label>
                <label className="ad-check">
                  <input
                    type="checkbox"
                    required
                    checked={attested}
                    onChange={(e) => setAttested(e.target.checked)}
                  />
                  I checked the facts, currentness and rights; this is
                  non-sensitive public source material.
                </label>
                <button className="ad-primary" disabled={busy || !current}>
                  <FileCheck2 size={16} />
                  Record fact approval
                </button>
              </form>
            </details>
          </section>
          <section className="ad-panel">
            <div className="ad-panel-heading">
              <h2>
                <Languages size={18} /> Explanation & keyword preparation
              </h2>
              <Pill>Requires editor signoff</Pill>
            </div>
            <fieldset className="ad-source-picker">
              <legend>Languages</legend>
              {[
                ["en", "English"],
                ["hi", "हिन्दी"],
                ["kn", "ಕನ್ನಡ"],
              ].map(([lang, label]) => (
                <label key={lang}>
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang)}
                    onChange={(e) =>
                      setSelectedLanguages(
                        e.target.checked
                          ? [...selectedLanguages, lang]
                          : selectedLanguages.filter((x) => x !== lang),
                      )
                    }
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <div className="ad-actions">
              <button
                className="ad-primary"
                disabled={
                  busy ||
                  !detail.scheme.contentApprovalId ||
                  !selectedLanguages.length
                }
                onClick={() =>
                  action(
                    () =>
                      api.post(`/content/schemes/${schemeId}/prepare`, {
                        languages: selectedLanguages,
                      }),
                    "Preparation jobs queued; the worker will check entitlement and budget.",
                  )
                }
              >
                <Sparkles size={16} />
                Queue preparation
              </button>
            </div>
            <p className="ad-muted">
              Each version/language is deduplicated. Missing facts remain
              unknown. Raw source evidence is never replaced.
            </p>
          </section>
          <section className="ad-panel">
            <div className="ad-panel-heading">
              <h2>Derived language versions</h2>
              <Pill>{detail.artifacts.length} artifacts</Pill>
            </div>
            {!detail.artifacts.length && (
              <p className="ad-empty">
                No explanations prepared for this scheme yet.
              </p>
            )}
            <div className="ad-artifact-grid">
              {detail.artifacts.map((a) => (
                <article key={a._id} className="ad-artifact-card">
                  <p>
                    <Pill>{a.language}</Pill> <Pill>{a.state}</Pill>{" "}
                    <Pill>{a.dataClass}</Pill>
                    {a.stale && <Pill>STALE</Pill>}
                  </p>
                  <h3>{a.output?.title || "Invalid output"}</h3>
                  <p>{a.output?.summary}</p>
                  <small>
                    {a.provider} / {a.model} · revision {a.revision} ·{" "}
                    {a.usage?.totalTokens || 0} tokens
                  </small>
                  <small>
                    Keywords: {a.output?.keywords?.join(", ") || "Unavailable"}
                  </small>
                  <div className="ad-actions">
                    <button
                      onClick={() => {
                        setArtifact(a);
                        setEdited(JSON.stringify(a.output, null, 2));
                        setReason("");
                        setInspected(ids=>ids.includes(a._id)?ids:[...ids,a._id]);
                      }}
                    >
                      Inspect / edit / review
                    </button>
                    {a.state==='REVIEW_PENDING'&&!a.stale&&a.validation?.ok&&!detail.artifacts.some(next=>next.previousArtifactId===a._id)&&<label className="ad-check"><input type="checkbox" aria-label={'Select inspected '+a.language+' artifact'} disabled={busy||!inspected.includes(a._id)} checked={reviewSelection.includes(a._id)} onChange={e=>setReviewSelection(ids=>e.target.checked?[...ids,a._id]:ids.filter(id=>id!==a._id))}/>Select after inspecting this revision</label>}
                  </div>
                  {a.state === "APPROVED" && !a.stale && (
                    <label className="ad-check">
                      <input
                        type="radio"
                        name={`publish-${a.language}`}
                        checked={chosen[a.language] === a._id}
                        onChange={() =>
                          setChosen({ ...chosen, [a.language]: a._id })
                        }
                      />
                      Select {a.language} for publication
                    </label>
                  )}
                </article>
              ))}
            </div>
          </section>
          <section className="ad-panel">
            <div className="ad-panel-heading">
              <h2>Review & publication</h2>
              <Pill>Separate from eligibility approval</Pill>
            </div>
            <p>
              Choose current approved English and any available reviewed
              translations. Missing translations fall back transparently to
              reviewed English. Every publication or withdrawal is audited.
              Synthetic test records remain excluded from public reads.
            </p>
            <label>
              Publication decision evidence
              <textarea
                minLength={10}
                value={publishReason}
                onChange={(e) => setPublishReason(e.target.value)}
                rows={3}
              />
            </label>
            <div className="ad-actions">
              <button
                className="ad-primary"
                disabled={
                  busy || !chosen.en || publishReason.trim().length < 10
                }
                onClick={() =>
                  action(
                    () =>
                      api.post(`/content/schemes/${schemeId}/publication`, {
                        artifactIds: Object.values(chosen),
                        evidence: publishReason,
                      }),
                    "Publication decision recorded; current approved content is indexed.",
                  )
                }
              >
                Publish selected versions
              </button>
              <button
                disabled={busy || publishReason.trim().length < 10}
                onClick={() =>
                  action(
                    () =>
                      api.post(`/content/schemes/${schemeId}/publication`, {
                        artifactIds: [],
                        evidence: publishReason,
                        withdraw: true,
                      }),
                    "Publication withdrawn.",
                  )
                }
              >
                Withdraw publication
              </button>
            </div>
            <details>
              <summary>Publication history / rollback candidates</summary>
              <p>
                To restore an earlier reviewed artifact, select that
                still-current approved revision and republish with a reason.
                Outdated source versions cannot be rolled back as current facts.
              </p>
              <SourceJson value={detail.publications} />
            </details>
          </section>
          <section className="ad-panel">
            <h2>Indexed language preview</h2>
            <details><summary>Record selected editorial decisions</summary><p>Inspect each current language revision and its source before selecting it. These decisions do not publish content or approve eligibility rules.</p><label>Selected-artifact review evidence<textarea value={batchReason} onChange={e=>setBatchReason(e.target.value)} minLength={10}/></label><label className="ad-check"><input type="checkbox" checked={batchAttested} onChange={e=>setBatchAttested(e.target.checked)}/>I have personally reviewed every selected language revision, keyword and source caveat.</label><button disabled={busy||!batchAttested||batchReason.trim().length<10||!reviewSelection.length} onClick={reviewSelected}>Approve {reviewSelection.length} selected inspected artifacts</button></details>
            <form
              className="ad-filters"
              onSubmit={(e) => {
                e.preventDefault();
                action(async () => {
                  const r = await api.get("/content/search-preview", {
                    params: { q: search, language: searchLanguage },
                  });
                  setResults(r.data);
                }, "MongoDB search completed.");
              }}
            >
              <label>
                Search reviewed keywords
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <label>
                Preview language
                <select
                  value={searchLanguage}
                  onChange={(e) => setSearchLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="kn">ಕನ್ನಡ</option>
                </select>
              </label>
              <button>Search index</button>
            </form>
            {results && <SourceJson value={results} />}
          </section>
        </>
      )}
      <section className="ad-panel">
        <div className="ad-panel-heading">
          <h2>AI work queue</h2>
          <Pill>Latest {jobs.length}</Pill>
        </div>
        {!jobs.length && <p className="ad-empty">No preparation jobs yet.</p>}
        <div className="ad-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Scheme / language</th>
                <th>Origin</th>
                <th>Status</th>
                <th>Provider / model</th>
                <th>Attempts / safe error</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id}>
                  <td>
                    {j.schemeId}
                    <small>
                      {j.language} · {j.sourceVersionId}
                    </small>
                  </td>
                  <td>{j.dataClass}</td>
                  <td>{j.state}</td>
                  <td>
                    {j.provider}
                    <small>{j.model}</small>
                  </td>
                  <td>
                    {j.attempts}
                    <small>{j.errorCode}</small>
                  </td>
                  <td>
                    {["FAILED", "BLOCKED", "DEFERRED"].includes(j.state) && (
                      <button
                        disabled={busy}
                        onClick={() =>
                          action(
                            () => api.post(`/content/jobs/${j._id}/retry`),
                            "Retry queued with the same source/version gates.",
                          )
                        }
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {artifact && (
        <section className="ad-panel ad-editor" aria-label="Artifact editor">
          <div className="ad-panel-heading">
            <h2>Review {artifact.language} artifact</h2>
            <button onClick={() => setArtifact(null)}>Close editor</button>
          </div>
          <div className="ad-columns">
            <div>
              <h3>Approved source excerpt</h3>
              <p className="ad-evidence-text">
                {
                  detail?.approvals.find((a) => a._id === artifact.approvalId)
                    ?.excerpt
                }
              </p>
              <SourceJson value={artifact.validation} />
              <SourceJson
                value={{
                  provider: artifact.provider,
                  model: artifact.model,
                  prompt: artifact.promptVersion,
                  usage: artifact.usage,
                  attempts: artifact.attempts,
                  costBoundUsd: artifact.costUsd,
                }}
              />
            </div>
            <div>
              <label>
                Proposed explanation and keywords (JSON)
                <textarea
                  rows={24}
                  value={edited}
                  onChange={(e) => setEdited(e.target.value)}
                  spellCheck={false}
                />
              </label>
              <section aria-label="Readable artifact preview" lang={artifact.language}>
                <h3>{artifact.output.title}</h3><p>{artifact.output.summary}</p>
                <h4>Audience information, not an eligibility verdict</h4><p>{artifact.output.whoItMayHelp}</p>
                <h4>Benefits</h4><ul>{artifact.output.benefits.map((text,i)=><li key={i}>{text}</li>)}</ul>
                <h4>Documents and currentness gaps</h4>
                {!artifact.output.documents.length&&<p>No verified document checklist in this fact packet; this does not mean documents are unnecessary.</p>}
                <ul>{artifact.output.limitations.map((text,i)=><li key={i}>{text}</li>)}</ul>
                <h4>Search keywords and romanized terms</h4><p>{[...artifact.output.keywords,...artifact.output.romanized].join(' · ')}</p>
                <p>This preview shows the stored revision. Save JSON changes as a new draft before reviewing them.</p>
              </section>
            </div>
          </div>
          <label>
            Editor decision evidence
            <textarea
              rows={3}
              minLength={10}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <div className="ad-actions">
            <button
              disabled={busy || reason.trim().length < 10 || artifact.stale}
              onClick={() => review("EDIT")}
            >
              Save as a new draft revision
            </button>
            <button
              className="ad-primary"
              disabled={
                busy ||
                reason.trim().length < 10 ||
                artifact.stale ||
                artifact.state !== "REVIEW_PENDING"
              }
              onClick={() => review("APPROVE")}
            >
              Approve stored artifact
            </button>
            <button
              disabled={busy || reason.trim().length < 10 || artifact.stale}
              onClick={() => review("REJECT")}
            >
              Reject
            </button>
          </div>
          <p className="ad-muted">
            Edits do not overwrite a reviewed snapshot. Save a new draft,
            inspect it, then approve it separately.
          </p>
        </section>
      )}
    </>
  );
}
