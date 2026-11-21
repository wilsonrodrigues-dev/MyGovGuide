import {ContentWorkbench} from './ContentWorkbench.jsx';
import { useEffect, useState, useCallback, useRef } from "react";
import { NavLink, Routes, Route, Navigate, Link,useLocation } from "react-router-dom";
import {
  Landmark,
  LayoutDashboard,
  Database,
  Radio,
  Activity,
  CalendarClock,
  History,
  Search,
  GitCompareArrows,
  ClipboardCheck,
  ShieldCheck,
  LogOut,
  ArrowUpRight,
  RefreshCw,
  Play,
  X,
  Languages,
  FileCheck2,
} from "lucide-react";
import { adminApi as api, errorText } from "./api.js";
import "./admin.css";
import { ContentWorkspace, PipelineStatus } from "./ContentWorkspace.jsx";
import {SchemeCollectionTable} from './SchemeCollectionTable.jsx';
import {SourceCoverage} from './SourceCoverage.jsx';
import {FormWorkspace} from './FormWorkspace.jsx';
import {EvidenceReviewWorkspace,EvidencePacket} from './EvidenceReviewWorkspace.jsx';
import {ContentHub} from './ContentHub.jsx';
import {LiveMonitor} from './LiveMonitor.jsx';
const date = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not yet";
const sections = [
  ["", "Overview", LayoutDashboard],
  ["sources", "Sources", Radio],
  ["collection", "Run collection", Play],
  ["monitor", "Live monitor", Activity],
  ["schedules", "Schedules", CalendarClock],
  ["history", "Execution history", History],
  ["data", "Data explorer", Database],
  ["changes", "Change Radar", GitCompareArrows],
  ["reviews", "Review queue", ClipboardCheck],
  ["ai", "AI processing", Languages],
  ["publish", "Review & publish", FileCheck2],
  ["forms", "Forms guidance", FileCheck2],
  ["system", "System", ShieldCheck],
];
function Badge({ children }) {
  return (
    <span
      className={`ad-badge ${/SUCCESS|APPROVED|ENABLED/.test(String(children)) ? "ad-good" : /FAIL|REJECT|RESTRICT|BLOCK/.test(String(children)) ? "ad-warn" : ""}`}
    >
      {children || "Unknown"}
    </span>
  );
}
function Json({ value }) {
  return <pre className="ad-json">{JSON.stringify(value, null, 2)}</pre>;
}
function useData(url, poll = false) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    try {
      const { data } = await api.get(url);
      setData(data);
      setError("");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, [url]);
  useEffect(() => {
    setLoading(true);
    setData(null);
    reload();
    if (poll) {
      const id = setInterval(reload, 3000);
      return () => clearInterval(id);
    }
  }, [reload, poll]);
  return { data, error, loading, reload };
}
function State({ loading, error, empty }) {
  return error ? (
    <p role="alert" className="ad-error">
      {error}
    </p>
  ) : loading ? (
    <p role="status" className="ad-muted">
      Loading database records…
    </p>
  ) : empty ? (
    <p className="ad-empty">No records match this view yet.</p>
  ) : null;
}
function Title({ eyebrow = "OPERATIONS WORKSPACE", title, children }) {
  return (
    <header className="ad-title">
      <div>
        <p className="ad-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {children}
    </header>
  );
}
function Panel({ title, children, aside }) {
  return (
    <section className="ad-panel">
      <div className="ad-panel-heading">
        <h2>{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
function Pager({ data, page, setPage }) {
  return data ? (
    <div className="ad-pager">
      <span>
        {data.total} records · page {page}
      </span>
      <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <button
        disabled={page * data.limit >= data.total}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  ) : null;
}
function Modal({ title, close, children }) {
  const ref = useRef(null),
    closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    const handler = (e) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        const nodes = [
          ...ref.current.querySelectorAll(
            'button:not(:disabled),a[href],input,select,textarea,[tabindex="0"]',
          ),
        ];
        const first = nodes[0],
          last = nodes.at(-1);
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, []);
  return (
    <div className="ad-overlay">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="ad-modal"
        tabIndex={-1}
        ref={ref}
      >
        <header>
          <h2>{title}</h2>
          <button aria-label="Close details" onClick={close}>
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
function RecordDetails({ type, id, close }) {
  const state = useData(`/data/${type}/${encodeURIComponent(id)}`);
  return (
    <Modal title="Record & provenance" close={close}>
      <State {...state} />
      {state.data && (
        <>
          <p>
            <Badge>{state.data.record.status}</Badge>{" "}
            <Badge>{state.data.record.publicationStatus}</Badge>
          </p>
          <h3>{state.data.record.title || id}</h3>
          {state.data.record.sourceUrl && (
            <a
              href={state.data.record.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Official source ↗
            </a>
          )}
          <p className="ad-muted">
            Observed research stays internal. Missing dates are not inferred.
          </p>
          <Json value={state.data} />
        </>
      )}
    </Modal>
  );
}
function Overview() {
  const state = useData("/stats", true),
    d = state.data;
  const labels = {
    Scheme: "Schemes",
    FormTemplate: "Forms",
    Notice: "Notices",
    ScamAlert: "Scam awareness & alerts",
    Source: "Registered sources",
    approvedSources: "Approved sources",
    restrictedSources: "Restricted sources",
    researchOnly: "Research-only records",
    
    ChangeEvent: "Change events",
    ImportRejection: "Historical import rejections",
  };
  const chart = d
    ? ["Scheme", "FormTemplate", "Notice", "ScamAlert"].map((key) => [
        labels[key],
        d.counts[key],
      ])
    : [];
  return (
    <>
      <Title title="Dashboard">
        <Link className="ad-primary" to="/admin/collection">
          <Play size={16} /> Run collection
        </Link>
      </Title>
      <p className="ad-subtitle">
        Research in, evidence checked, people informed. Every record has a
        source.
      </p>
      <State {...state} />
      {d?.operational&&<section aria-label="Operational content statistics"><div className="ad-metrics">{Object.entries({totalSchemes:'Total schemes',publishedSchemes:'Published schemes',fullyEnrichedSchemes:'Fully enriched schemes',executableEligibilitySchemes:'Complete executable eligibility',availableForms:'Available form references',checkedFormDocuments:'Checked form documents',completeMultilingualFormGuides:'Complete multilingual form guides',publicNotices:'Public notices',scamAwarenessRecords:'Scam-awareness records',successfulAIProcessingJobs:'Successful AI processing jobs',failedProcessingJobs:'Failed processing jobs'}).map(([key,label])=><article key={key}><span>{label}</span><strong>{d.operational[key]}</strong><small>From current database checks</small></article>)}</div><p>Last data update: {date(d.operational.lastDataUpdate)} · Last successful collection: {date(d.operational.lastSuccessfulCollection)}</p></section>}
      <details className="ad-panel"><summary>Diagnostics / Blocked Content</summary><p>Unresolved source rights, official facts and document editions remain in the existing review workspace.</p><Link to="/admin/attention">Open blocked content diagnostics</Link>{d?.operational&&<p>{d.operational.diagnostics.supersededFailedAIJobs} retained failed AI attempts have valid current replacements. Their audit history is preserved.</p>}</details>
      <p><Link to="/admin/content">Open Content &rarr; Preview &rarr; Approve &amp; Publish</Link></p>
      <details className="ad-panel"><summary>Advanced pipeline and inventory</summary>
      <State {...state} />
      {d && (
        <>
          <div className="ad-metrics">
            {Object.entries(labels).map(([key, label]) => (
              <article key={key}>
                <span>{label}</span>
                <strong>{d.counts[key]}</strong>
                <small>
                  {key === "ImportRejection"
                    ? "Retained audit history"
                    : "From MongoDB"}
                </small>
              </article>
            ))}
          </div>
          <div className="ad-columns">
            <Panel
              title="The research library"
              aside={<span className="ad-muted">Record counts</span>}
            >
              <div
                className="ad-bars"
                role="img"
                aria-label={chart
                  .map(([name, count]) => `${name}: ${count}`)
                  .join(", ")}
              >
                {chart.map(([name, count]) => (
                  <div key={name}>
                    <span>{name}</span>
                    <div>
                      <i
                        style={{
                          width: `${Math.max(1, (count / Math.max(1, ...chart.map((x) => x[1]))) * 100)}%`,
                        }}
                      />
                    </div>
                    <b>{count}</b>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Collection outcomes">
              <p className="ad-muted">
                Fixture and live results are counted separately.
              </p>
              {d.completed.length ? (
                d.completed.map((row) => (
                  <div className="ad-outcome" key={row._id}>
                    <Badge>{row._id}</Badge>
                    <span>
                      {row.successful} successful / {row.failed} failed /{" "}
                      {row.skipped} skipped
                    </span>
                    <b>
                      {row.successful + row.failed
                        ? Math.round(
                            (row.successful / (row.successful + row.failed)) *
                              100,
                          )
                        : 0}
                      % success
                    </b>
                  </div>
                ))
              ) : (
                <p className="ad-empty">No completed collections yet.</p>
              )}
              <p>Latest collection: {date(d.latestCollection?.startedAt)}</p>
            </Panel>
          </div>
          <Panel
            title="Collection timeline"
            aside={<Link to="/admin/history">View jobs ↗</Link>}
          >
            <div
              className="ad-timeline"
              role="img"
              aria-label="Recent ingestion runs, newest first"
            >
              {d.recent.slice(0, 12).map((run) => (
                <div
                  key={run.id}
                  title={`${run.mode}: ${run.counters.read} read, ${run.outcome}`}
                >
                  <i
                    style={{
                      height: `${Math.max(5, Math.min(120, run.counters.read))}px`,
                    }}
                    className={run.outcome === "SUCCESS" ? "" : "ad-bar-warn"}
                  />
                  <small>{run.mode}</small>
                </div>
              ))}
            </div>
            <div className="ad-table-wrap">
              <table>
                <caption className="ad-sr-only">Recent ingestion runs</caption>
                <thead>
                  <tr>
                    <th>Run</th>
                    <th>Mode</th>
                    <th>Started (IST)</th>
                    <th>Outcome</th>
                    <th>Created / updated / unchanged / rejected</th>
                  </tr>
                </thead>
                <tbody>
                  {d.recent.slice(0, 8).map((run) => (
                    <tr key={run.id}>
                      <td>{run.id.slice(0, 18)}…</td>
                      <td>
                        <Badge>{run.mode}</Badge>
                      </td>
                      <td>{date(run.startedAt)}</td>
                      <td>
                        <Badge>{run.outcome}</Badge>
                      </td>
                      <td>
                        {["created", "updated", "unchanged", "rejected"]
                          .map((k) => run.counters[k] || 0)
                          .join(" / ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ad-muted">
              All-time ingestion totals (including imports):{" "}
              {["created", "updated", "unchanged", "rejected"]
                .map((k) => `${k} ${d.totals[k] || 0}`)
                .join(" · ")}
            </p>
          </Panel>
        </>
      )}
      </details>
    </>
  );
}
const approvalExample = {
  sourceId: "",
  enabled: true,
  host: "",
  approvedPaths: [],
  method: "rss",
  sourceTermsUrl: "",
  rightsBasis: "",
  robotsUrl: "",
  robotsObservedAt: "",
  robotsAllowed: true,
  rateLimit: { minIntervalMs: 5000, maxRequests: 10 },
  reviewedBy: "",
  approvalEvidence: "",
  approvalExpiry: "",
  testPlan: "",
  url: "",
  adapterOptions: {},
};
function Sources() {
  const state = useData("/sources"),
    [q, setQ] = useState(""),
    [selected, setSelected] = useState(null),
    [text, setText] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function action(kind) {
    setBusy(true);
    setMessage("");
    try {
      const id = encodeURIComponent(selected.id);
      if (kind === "save")
        await api.put(`/sources/${id}/config`, JSON.parse(text));
      else
        await api.post(
          `/sources/${id}/${kind === "validate" ? "validate" : "activation"}`,
          kind === "validate" ? {} : { enabled: kind === "enable" },
        );
      setMessage(
        kind === "save"
          ? "Saved. Validate evidence separately before activation."
          : "Source configuration updated.",
      );
      state.reload();
    } catch (e) {
      setMessage(e instanceof SyntaxError ? "Enter valid JSON." : errorText(e));
    } finally {
      setBusy(false);
    }
  }
  const items =
    state.data?.items.filter((s) =>
      `${s.title} ${s.id} ${s.url}`.toLowerCase().includes(q.toLowerCase()),
    ) || [];
  return (
    <>
      <Title title="Sources & permissions" />
      <p className="ad-subtitle">
        Public access is only the beginning. Automation requires explicit
        evidence and validation.
      </p>
      <label className="ad-search">
        <Search size={18} />
        <input
          aria-label="Search sources"
          placeholder="Search sources by name, ID or URL"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>
      <State {...state} empty={!items.length} />
      <Panel title={`${items.length} sources`}>
        <div className="ad-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Type / method</th>
                <th>Access & activation</th>
                <th>Last collection</th>
                <th>Outcome / records</th>
                <th>Configuration</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.title}</strong>
                    <small>
                      {s.id} ·{" "}
                      <a href={s.url} target="_blank" rel="noreferrer">
                        Official website ↗
                      </a>
                    </small>
                  </td>
                  <td>
                    {s.sourceType || "Research"}
                    <small>{s.collectionMethod}</small>
                    {s.fixtureAvailable && <Badge>Fixture available</Badge>}
                  </td>
                  <td>
                    <Badge>
                      {s.authorizationStatus === "APPROVED"
                        ? "APPROVED"
                        : "RESTRICTED"}
                    </Badge>
                    <small>{s.config?.enabled ? "ENABLED" : "Disabled"}</small>
                  </td>
                  <td>{date(s.lastSuccessfulCollection)}</td>
                  <td>
                    <Badge>{s.latestJob?.state || "No job history"}</Badge>
                    <small>{s.latestJob?.counters?.read ?? "—"} records</small>
                    <small>{s.lastCollectionError || s.latestJob?.error}</small>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelected(s);
                        setText(
                          JSON.stringify(
                            s.config?.approval || {
                              ...approvalExample,
                              sourceId: s.id,
                              host: new URL(s.url).hostname,
                              url: s.url,
                            },
                            null,
                            2,
                          ),
                        );
                        setMessage("");
                      }}
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      {selected && (
        <Modal
          title={`Configure ${selected.id}`}
          close={() => setSelected(null)}
        >
          <p>
            Record the actual access and reuse evidence. Saving disables
            activation and invalidates previous validation. No toggle grants
            missing permission. myScheme remains excluded.
          </p>
          <label>
            Approval evidence JSON
            <textarea
              rows={20}
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
            />
          </label>
          <div className="ad-actions">
            <button disabled={busy} onClick={() => action("save")}>
              Save evidence
            </button>
            <button disabled={busy} onClick={() => action("validate")}>
              Validate separately
            </button>
            <button disabled={busy} onClick={() => action("enable")}>
              Activate
            </button>
            <button disabled={busy} onClick={() => action("disable")}>
              Disable
            </button>
          </div>
          <p role="status">{message}</p>
          <p className="ad-muted">
            Validation checks the evidence contract, expiry, approved paths and
            public DNS. The named operator remains responsible for supplying
            truthful permission evidence.
          </p>
        </Modal>
      )}
    </>
  );
}
function JobDetail({ id, close }) {
  const state = useData(`/jobs/${id}`, true);
  return (
    <Modal title="Execution details" close={close}>
      <State {...state} />
      {state.data && (
        <>
          <p>
            <Badge>{state.data.job.mode}</Badge>{" "}
            <Badge>{state.data.job.trigger}</Badge>{" "}
            <Badge>{state.data.job.state}</Badge>
          </p>
          <p role="status">{state.data.job.progress}</p>
          {["QUEUED", "RUNNING"].includes(state.data.job.state) && (
            <button
              onClick={() => api.post(`/jobs/${id}/cancel`).then(state.reload)}
            >
              Request cancellation
            </button>
          )}
          <Json value={state.data} />
        </>
      )}
    </Modal>
  );
}
function Collection() {
  const state = useData("/sources"),
    [sourceId, setSourceId] = useState("fixture-api"),
    [mode, setMode] = useState("FIXTURE"),
    [job, setJob] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const sources =
    state.data?.items.filter((s) =>
      mode === "FIXTURE" ? s.fixtureAvailable : s.config?.enabled,
    ) || [];
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await api.post("/jobs", { sourceId, mode });
      setJob(r.data._id);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Title title="Collect with confidence" />
      <p className="ad-subtitle">
        Start a job here. The dedicated worker handles fetching, validation and
        provenance.
      </p>
      <div className="ad-columns">
        <Panel title="New collection">
          <form className="ad-form" onSubmit={submit}>
            <label>
              Collection mode
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                  setSourceId("");
                }}
              >
                <option value="FIXTURE">
                  Offline fixture · synthetic demonstration
                </option>
                <option value="LIVE">Live · approved official sources</option>
              </select>
            </label>
            <label>
              Configured source
              <select
                required
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
              >
                <option value="">Select a source</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            {!sources.length && !state.loading && (
              <p className="ad-empty">
                No approved source is enabled for this mode. Complete source
                authorization first.
              </p>
            )}
            <button className="ad-primary" disabled={busy || !sources.length}>
              <Play size={16} />
              {busy ? "Queuing…" : "Run collection"}
            </button>
            <p role="alert" className="ad-error">
              {error}
            </p>
            <State {...state} />
          </form>
        </Panel>
        <Panel title="Every run is accountable">
          <ul className="ad-principles">
            <li>One active job per source.</li>
            <li>Authorization is checked at enqueue and execution.</li>
            <li>Whole source batches commit atomically.</li>
            <li>Collected records enter the review queue.</li>
            <li>Cancellation waits for a safe boundary.</li>
          </ul>
          <Link to="/admin/history">Open execution history ↗</Link>
        </Panel>
      </div>
      {job && <JobDetail id={job} close={() => setJob(null)} />}
      <SourceCoverage/>
      <SchemeCollectionTable/>
    </>
  );
}
const initialSchedule = {
  name: "",
  enabled: false,
  kind: "DAILY",
  time: "06:00",
  weekday: 1,
  cron: "0 6 * * *",
  timezone: "Asia/Kolkata",
  sourceIds: ["fixture-api"],
  mode: "FIXTURE",
};
function Schedules() {
  const state = useData("/schedules"),
    sources = useData("/sources"),
    [form, setForm] = useState(initialSchedule),
    [editing, setEditing] = useState(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const field = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  async function submit(e, validate = false) {
    e?.preventDefault();
    setBusy(true);
    try {
      const r = validate
        ? await api.post("/schedules/validate", form)
        : editing
          ? await api.put(`/schedules/${editing}`, form)
          : await api.post("/schedules", form);
      setMessage(
        validate
          ? `Valid. Next occurrence: ${date(r.data.nextRun)} (IST)`
          : "Schedule saved.",
      );
      if (!validate) {
        state.reload();
        setEditing(null);
        setForm(initialSchedule);
      }
    } catch (e) {
      setMessage(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function toggle(row) {
    try {
      await api.post(`/schedules/${row._id}/activation`, {
        enabled: !row.enabled,
      });
      state.reload();
      setMessage("Schedule activation updated.");
    } catch (e) {
      setMessage(errorText(e));
    }
  }
  return (
    <>
      <Title title="A steady collection rhythm" />
      <p className="ad-subtitle">
        Schedules persist in MongoDB. Keep the native worker running to execute
        them.
      </p>
      <State {...state} />
      <Panel title="Saved schedules">
        <div className="ad-schedule-list">
          {state.data?.items.length ? (
            state.data.items.map((row) => (
              <article key={row._id}>
                <div>
                  <h3>{row.name}</h3>
                  <p>
                    <Badge>{row.mode}</Badge> {row.cron} · {row.timezone}
                  </p>
                  <small>
                    Next: {row.enabled ? date(row.nextRun) : "Disabled"} · Last:{" "}
                    {date(row.lastRun)} · {row.lastOutcome || "No execution"}
                  </small>
                </div>
                <div className="ad-actions">
                  <button
                    role="switch"
                    aria-checked={row.enabled}
                    aria-label={`Automatic collection for ${row.name}`}
                    className={row.enabled ? "ad-switch-on" : ""}
                    onClick={() => toggle(row)}
                  >
                    {row.enabled ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(row._id);
                      setForm(
                        Object.fromEntries(
                          Object.keys(initialSchedule).map((key) => [
                            key,
                            row[key],
                          ]),
                        ),
                      );
                    }}
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="ad-empty">
              No schedules yet. Create the first one below.
            </p>
          )}
        </div>
      </Panel>
      <Panel title={editing ? "Edit schedule" : "Create a schedule"}>
        <form className="ad-form ad-form-grid" onSubmit={submit}>
          <label>
            Schedule name
            <input
              required
              value={form.name}
              onChange={(e) => field("name", e.target.value)}
              placeholder="Morning research check"
            />
          </label>
          <label>
            Frequency
            <select
              value={form.kind}
              onChange={(e) => field("kind", e.target.value)}
            >
              {["DAILY", "TWICE_DAILY", "WEEKLY", "CUSTOM"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Local time
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => field("time", e.target.value)}
            />
          </label>
          <label>
            Timezone
            <input
              required
              list="ad-timezones"
              value={form.timezone}
              onChange={(e) => field("timezone", e.target.value)}
            />
            <datalist id="ad-timezones">
              <option>Asia/Kolkata</option>
              <option>UTC</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
            </datalist>
          </label>
          {form.kind === "WEEKLY" && (
            <label>
              Weekday
              <select
                value={form.weekday}
                onChange={(e) => field("weekday", +e.target.value)}
              >
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((x, i) => (
                  <option key={x} value={i}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
          )}
          {form.kind === "CUSTOM" && (
            <label>
              Cron expression
              <input
                required
                value={form.cron}
                onChange={(e) => field("cron", e.target.value)}
                placeholder="0 6 * * *"
              />
              <small>Five fields: minute hour day month weekday</small>
            </label>
          )}
          <label>
            Mode
            <select
              value={form.mode}
              onChange={(e) => {
                field("mode", e.target.value);
                field("sourceIds", []);
              }}
            >
              <option value="FIXTURE">Fixture</option>
              <option value="LIVE">Approved live</option>
            </select>
          </label>
          <fieldset className="ad-source-picker">
            <legend>Sources</legend>
            {sources.data?.items
              .filter((s) =>
                form.mode === "FIXTURE"
                  ? s.fixtureAvailable
                  : s.config?.enabled,
              )
              .map((s) => (
                <label key={s.id}>
                  <input
                    type="checkbox"
                    checked={form.sourceIds.includes(s.id)}
                    onChange={(e) =>
                      field(
                        "sourceIds",
                        e.target.checked
                          ? [...form.sourceIds, s.id]
                          : form.sourceIds.filter((id) => id !== s.id),
                      )
                    }
                  />
                  {s.title}
                </label>
              ))}
          </fieldset>
          <label className="ad-check">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => field("enabled", e.target.checked)}
            />
            Enable automatic collection
          </label>
          <div className="ad-actions">
            <button
              type="button"
              disabled={busy}
              onClick={() => submit(null, true)}
            >
              Validate schedule
            </button>
            <button className="ad-primary" disabled={busy}>
              {editing ? "Save changes" : "Create schedule"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(initialSchedule);
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
        <p role="status">{message}</p>
      </Panel>
    </>
  );
}
function HistoryPage() {
  const [page, setPage] = useState(1),
    [mode, setMode] = useState(""),
    [trigger, setTrigger] = useState(""),
    [status, setStatus] = useState(""),
    [selected, setSelected] = useState(null);
  const state = useData(
    `/jobs?page=${page}&limit=15${mode ? `&mode=${mode}` : ""}${trigger ? `&trigger=${trigger}` : ""}${status ? `&state=${status}` : ""}`,
    true,
  );
  return (
    <>
      <Title title="An open record of every run" />
      <div className="ad-filters">
        <label>
          Mode
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All modes</option>
            <option>FIXTURE</option>
            <option>LIVE</option>
          </select>
        </label>
        <label>
          Trigger
          <select
            value={trigger}
            onChange={(e) => {
              setTrigger(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All triggers</option>
            <option>MANUAL</option>
            <option>SCHEDULED</option>
          </select>
        </label>
        <label>
          Outcome
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All outcomes</option>
            {[
              "QUEUED",
              "RUNNING",
              "SUCCEEDED",
              "FAILED",
              "CANCELLED",
              "BLOCKED",
              "INTERRUPTED",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <State {...state} empty={!state.data?.items.length} />
      <Panel title="Collection jobs">
        <div className="ad-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job / run</th>
                <th>Source / mode</th>
                <th>Started / ended (IST)</th>
                <th>Duration</th>
                <th>Outcome</th>
                <th>Created / updated / unchanged / rejected</th>
                <th>Reviews / changes</th>
                <th>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {state.data?.items.map((row) => (
                <tr key={row._id}>
                  <td>
                    {row._id.slice(0, 12)}…
                    <small>{row.runId || "Awaiting worker"}</small>
                  </td>
                  <td>
                    {row.sourceId}
                    <small>
                      {row.mode} · {row.trigger}
                    </small>
                  </td>
                  <td>
                    {date(row.startedAt)}
                    <small>{date(row.finishedAt)}</small>
                  </td>
                  <td>
                    {row.finishedAt && row.startedAt
                      ? `${((new Date(row.finishedAt) - new Date(row.startedAt)) / 1000).toFixed(1)}s`
                      : "—"}
                  </td>
                  <td>
                    <Badge>{row.state}</Badge>
                    <small>{row.error}</small>
                  </td>
                  <td>
                    {["created", "updated", "unchanged", "rejected"]
                      .map((k) => row.counters?.[k] || 0)
                      .join(" / ")}
                  </td>
                  <td>
                    {row.counters?.reviewItems || 0} /{" "}
                    {row.counters?.changeEvents || 0}
                  </td>
                  <td>
                    <button onClick={() => setSelected(row._id)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager data={state.data} page={page} setPage={setPage} />
      </Panel>
      {selected && <JobDetail id={selected} close={() => setSelected(null)} />}
    </>
  );
}
function Explorer() {
  const [type, setType] = useState("Scheme"),
    [q, setQ] = useState(""),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState(null);
  const state = useData(
    `/data/${type}?page=${page}&q=${encodeURIComponent(search)}${status ? `&status=${status}` : ""}`,
  );
  return (
    <>
      <Title title="Follow the evidence" />
      <p className="ad-subtitle">
        Original research, classifications and immutable versions. Internal
        records stay internal.
      </p>
      <form
        className="ad-filters"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(q);
          setPage(1);
        }}
      >
        <label>
          Record type
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
          >
            {["Scheme", "FormTemplate", "Notice", "ScamAlert"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Verification
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {[
              "RESEARCH_ONLY",
              "REVIEW_REQUIRED",
              "REJECTED",
              "SOURCE_VERIFIED_FACT",
              "SUPERSEDED",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title or record ID"
          />
        </label>
        <button>Search</button>
      </form>
      <State {...state} empty={!state.data?.items.length} />
      <Panel title="Research records">
        <div className="ad-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Record</th>
                <th>Classification</th>
                <th>Observed date</th>
                <th>Verification / publication</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {state.data?.items.map((row) => (
                <tr key={row.id}>
                  <td>
                    <button
                      className="ad-text-button"
                      onClick={() => setSelected(row.id)}
                    >
                      {row.title}
                    </button>
                    <small>{row.id}</small>
                  </td>
                  <td>
                    {row.recordType ||
                      row.formKind ||
                      row.normalized?.programmeType ||
                      "Research"}
                  </td>
                  <td>
                    {row.normalized?.observedPublicationDate || "Not supplied"}
                  </td>
                  <td>
                    <Badge>{row.status}</Badge>
                    <small>{row.publicationStatus}</small>
                  </td>
                  <td>
                    <a href={row.sourceUrl} target="_blank" rel="noreferrer">
                      Official source ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager data={state.data} page={page} setPage={setPage} />
      </Panel>
      {selected && (
        <RecordDetails
          type={type}
          id={selected}
          close={() => setSelected(null)}
        />
      )}
    </>
  );
}
function ChangeDetails({ id, close }) {
  const state = useData(`/changes/${encodeURIComponent(id)}`);
  const d = state.data;
  return (
    <Modal title="Version comparison" close={close}>
      <State {...state} />
      {d && (
        <>
          <p>
            <Badge>{d.change.reviewStatus}</Badge> {d.change.entityType} ·{" "}
            {d.change.entityId}
          </p>
          <p>{d.change.summary}</p>
          <p>Changed fields: {d.change.changedFields.join(", ")}</p>
          <div className="ad-comparison">
            <div>
              <h3>Previous · revision {d.oldVersion?.revision}</h3>
              <Json value={d.oldVersion?.payload} />
            </div>
            <div>
              <h3>Observed · revision {d.newVersion?.revision}</h3>
              <Json value={d.newVersion?.payload} />
            </div>
          </div>
          <h3>Derived content impact & regeneration</h3>
          <Json value={d.derivedImpact} />
          <h3>Source evidence</h3>
          <Json
            value={{
              sourceIds: d.change.sourceIds,
              oldVersion: d.change.oldVersionId,
              newVersion: d.change.newVersionId,
              timestamp: d.change.createdAt,
              originalEvidence: d.newVersion?.original,
            }}
          />
        </>
      )}
    </Modal>
  );
}
function Changes() {
  const [page, setPage] = useState(1),
    [selected, setSelected] = useState(null);
  const state = useData(`/changes?page=${page}`);
  return (
    <>
      <Title title="Change Radar" />
      <p className="ad-subtitle">
        Material changes create a new version and require renewed review.
      </p>
      <State {...state} empty={!state.data?.items.length} />
      <Panel title="Observed changes">
        {state.data?.items.map((row) => (
          <article className="ad-change" key={row.id}>
            <GitCompareArrows size={20} />
            <div>
              <h3>
                {row.entityId} <Badge>{row.reviewStatus}</Badge>
              </h3>
              <p>{row.summary}</p>
              <small>
                {row.changedFields.join(", ")} · {date(row.createdAt)}
              </small>
            </div>
            <button onClick={() => setSelected(row.id)}>
              Compare versions
            </button>
          </article>
        ))}
        <Pager data={state.data} page={page} setPage={setPage} />
      </Panel>
      {selected && (
        <ChangeDetails id={selected} close={() => setSelected(null)} />
      )}
    </>
  );
}
function Reviews(){return <><EvidenceReviewWorkspace/><details className="ad-panel"><summary>Individual record actions (legacy)</summary><LegacyReviews/></details></>;}
function LegacyReviews() {
  const [page, setPage] = useState(1),
    [status, setStatus] = useState("PENDING"),
    [selected, setSelected] = useState(null),
    [details, setDetails] = useState(null),
    [evidence, setEvidence] = useState(""),
    [decision, setDecision] = useState("REVIEW_REQUIRED"),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const state = useData(`/reviews?page=${page}&status=${status}`);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(`/reviews/${encodeURIComponent(selected.id)}`, {
        evidence,
        status: decision,
      });
      setMessage("Review recorded with evidence.");
      setSelected(null);
      state.reload();
    } catch (e) {
      setMessage(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Title title="Human judgment, on record" />
      <p className="ad-subtitle">
        Inspect evidence, request further review or reject. Eligibility approval
        is outside this dashboard.
      </p>
      <label className="ad-inline-label">
        Queue
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option>PENDING</option>
          <option>RESOLVED</option>
        </select>
      </label>
      <p role="status">{message}</p>
      <State {...state} empty={!state.data?.items.length} />
      <Panel title="Review queue">
        <div className="ad-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Record</th>
                <th>Reason</th>
                <th>Queue</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {state.data?.items.map((row) => (
                <tr key={row.id}>
                  <td>
                    {row.entityType}
                    <small>{row.entityId}</small>
                  </td>
                  <td>{row.reason}</td>
                  <td>
                    <Badge>{row.queueStatus}</Badge>
                  </td>
                  <td>
                    <div className="ad-actions">
                      <button onClick={() => setDetails(row)}>
                        Inspect facts
                      </button>
                      {row.queueStatus === "PENDING" && (
                        <button
                          onClick={() => {
                            setSelected(row);
                            setEvidence("");
                          }}
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager data={state.data} page={page} setPage={setPage} />
      </Panel>
      {details && (
        <RecordDetails
          type={details.entityType}
          id={details.entityId}
          close={() => setDetails(null)}
        />
      )}
      {selected && (
        <Modal
          title={`Review ${selected.entityId}`}
          close={() => setSelected(null)}
        >
          <form className="ad-form" onSubmit={submit}>
            <p>Version: {selected.versionId || "Research fact"}</p>
            <EvidencePacket packetKey={selected.entityType+':'+selected.entityId} onLoaded={()=>setSelected(current=>current?{...current,packetLoaded:true}:null)}/>
            <label>
              Decision
              <select
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
              >
                <option value="REVIEW_REQUIRED">Further review required</option>
                <option value="REJECTED">Reject</option>
              </select>
            </label>
            <label>
              Optional rejection note
              <textarea
                maxLength={4000}
                rows={5}
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Optional reason. Existing evidence is attached automatically."
              />
            </label>
            <button className="ad-primary" disabled={busy||!selected.packetLoaded}>
              Record decision
            </button>
            <p role="status">{message}</p>
          </form>
        </Modal>
      )}
    </>
  );
}
function System() {
  const state = useData("/system", true),
    audits = useData("/audit?limit=15");
  return (
    <>
      <Title title="System & accountability" />
      <State {...state} />
      {state.data && (
        <div className="ad-columns">
          <Panel title="Service health">
            <dl className="ad-health">
              {Object.entries(state.data)
                .filter(([key]) => key !== "workers")
                .map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{String(value)}</dd>
                  </div>
                ))}
            </dl>
          </Panel>
          <Panel title="Worker presence">
            {state.data.workers.length ? (
              state.data.workers.map((w) => (
                <p key={w._id}>
                  <Badge>{w.state}</Badge> Last seen {date(w.lastSeen)}
                </p>
              ))
            ) : (
              <p className="ad-empty">
                No recent worker heartbeat. Start <code>npm run worker</code> in
                a separate terminal.
              </p>
            )}
            <p className="ad-muted">
              The API queues work; the native worker executes jobs and persisted
              schedules.
            </p>
          </Panel>
        </div>
      )}
      <Panel title="Recent admin audit">
        <State {...audits} />
        <div className="ad-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Actor</th>
                <th>Target</th>
                <th>When (IST)</th>
              </tr>
            </thead>
            <tbody>
              {audits.data?.items.map((row) => (
                <tr key={row._id}>
                  <td>{row.action}</td>
                  <td>{row.actor}</td>
                  <td>{row.target}</td>
                  <td>{date(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
export function AdminApp() {
  const location=useLocation(),[advanced,setAdvanced]=useState(false);
  useEffect(()=>{setAdvanced(!['/admin','/admin/','/admin/content','/admin/attention'].includes(location.pathname));},[location.pathname]);
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true),
    [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api
      .get("/auth/session")
      .then((r) => {
        setUser(r.data.user);
        
      })
      .catch((e) => {
        if (e.response?.status !== 401) setError(errorText(e));
      })
      .finally(() => setLoading(false));
    const id = api.interceptors.response.use(
      (r) => r,
      (e) => {
        if (e.response?.status === 401) {
          setUser(null);
          
        }
        return Promise.reject(e);
      },
    );
    return () => api.interceptors.response.eject(id);
  }, []);
  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await api.post("/auth/login", { username, password });
      setUser(r.data.user);
      
      setPassword("");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      await api.post("/auth/logout");
      setUser(null);
      
    } catch (e) {
      setError(errorText(e));
    }
  }
  if (loading)
    return (
      <div className="admin-root ad-login">
        <p role="status">Opening operations workspace…</p>
      </div>
    );
  if (!user)
    return (
      <div className="admin-root ad-login">
        <div className="ad-login-story">
          <Landmark size={38} />
          <p className="ad-eyebrow">MYGOVGUIDE · OPERATIONS</p>
          <h1>Good information starts with good evidence.</h1>
          <p>
            A private workspace for source permissions, careful collection and
            accountable review.
          </p>
          <Link to="/">Return to MyGovGuide ↗</Link>
        </div>
        <form className="ad-login-card ad-form" onSubmit={login}>
          <ShieldCheck size={28} />
          <p className="ad-eyebrow">AUTHORIZED ADMINISTRATORS</p>
          <h2>Welcome to operations</h2>
          <p className="ad-muted">Sign in with your administrator account.</p>
          <label>
            Username
            <input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="ad-primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in securely"}
            <ArrowUpRight size={17} />
          </button>
          {error && (
            <p className="ad-error" role="alert">
              {error}
            </p>
          )}
          <small>
            Set ADMIN_USERNAME and ADMIN_PASSWORD privately in backend/.env.
          </small>
        </form>
      </div>
    );
  return (
    <div className="admin-root ad-shell">
      <aside className="ad-sidebar">
        <Link to="/admin" className="ad-brand">
          <Landmark size={27} />
          <span>
            MyGovGuide<small>OPERATIONS</small>
          </span>
        </Link>
        <p className="ad-nav-caption">WORKSPACE</p>
        <nav aria-label="Admin navigation">
          {[['','Dashboard',LayoutDashboard],['content','Content',Database],['attention','Needs Attention',ClipboardCheck]].map(([path,name,Icon])=><NavLink key={path} to={'/admin'+(path?'/'+path:'')} end={!path}><Icon size={18}/>{name}</NavLink>)}
          <details className="ad-advanced-nav" open={advanced} onToggle={e=>setAdvanced(e.currentTarget.open)}><summary>Advanced / Operations</summary>
          {sections.map(([path, name, Icon]) => (
            <NavLink
              key={path}
              to={`/admin${path ? `/${path}` : ""}`}
              end={!path}
            >
              <Icon size={18} />
              {name}
            </NavLink>
          ))}
          </details>
        </nav>
        <div className="ad-sidebar-bottom">
          <ShieldCheck size={20} />
          <p>
            Evidence before action.
            <small>Research stays internal until reviewed.</small>
          </p>
          <Link to="/">Citizen site ↗</Link>
        </div>
      </aside>
      <div className="ad-workspace">
        <div className="ad-topbar">
          <span>
            MyGovGuide <b>/</b> Operations
          </span>
          <div>
            <Badge>PRIVATE WORKSPACE</Badge>
            <span className="ad-email">{user.username}</span>
            <button onClick={logout} aria-label="Sign out">
              <LogOut size={17} />
            </button>
          </div>
        </div>
        <main className="ad-main">
          {error && (
            <p role="alert" className="ad-error">
              {error}
            </p>
          )}
          <Routes>
            <Route index element={<Overview />} />
            <Route path="content" element={<ContentWorkbench />} />
            <Route path="attention" element={<ContentWorkbench attentionOnly />} />
            <Route path="sources" element={<Sources />} />
            <Route path="collection" element={<Collection />} />
            <Route path="monitor" element={<LiveMonitor />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="data" element={<Explorer />} />
            <Route path="changes" element={<Changes />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="ai" element={<ContentWorkspace />} />
            <Route path="publish" element={<ContentWorkspace reviewMode />} />
            <Route path="forms" element={<FormWorkspace />} />
            <Route path="system" element={<System />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
          <footer className="ad-footer">
            <span>MYGOVGUIDE / RESEARCH OPERATIONS</span>
            <span>All timestamps shown in IST unless specified.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
