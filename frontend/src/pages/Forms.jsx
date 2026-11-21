import {completionCopy} from '../i18n/completion.js';
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileText, Upload, ArrowUpRight, ShieldCheck } from "lucide-react";
import { api } from "../lib/api.js";
import { formsCopy } from "../i18n/forms.js";
import { useAssistant, usePageVoice } from "../context/VoiceContext.jsx";
import "../forms.css";
import {formLabelHelp} from '../lib/formLabelHelp.js';
import {FormExperience} from '../components/FormExperience.jsx';
import {formGuidanceFields} from '../lib/formGuidanceFields.js';
function SourceLink({ url, children }) {
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children} <ArrowUpRight size={15} />
    </a>
  ) : null;
}
const warningText = {
  PREMIUM_OUTDATED: {
    en: "This official form edition prints an outdated premium. Confirm the current premium and edition with the bank or post office before paying.",
    hi: "इस आधिकारिक फॉर्म संस्करण में पुराना प्रीमियम छपा है। भुगतान से पहले बैंक या डाकघर से वर्तमान प्रीमियम और संस्करण की पुष्टि करें।",
    kn: "ಈ ಅಧಿಕೃತ ಫಾರ್ಮ್ ಆವೃತ್ತಿಯಲ್ಲಿ ಹಳೆಯ ಪ್ರೀಮಿಯಂ ಮುದ್ರಿಸಲಾಗಿದೆ. ಪಾವತಿಸುವ ಮೊದಲು ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಂಚೆ ಕಚೇರಿಯಲ್ಲಿ ಪ್ರಸ್ತುತ ಪ್ರೀಮಿಯಂ ಮತ್ತು ಆವೃತ್ತಿಯನ್ನು ದೃಢೀಕರಿಸಿ.",
  },
  RESEARCH_ONLY: {
    en: "This scheme is research-only in MyGovGuide. The form is linked for reference, not as a published scheme or an application guarantee.",
    hi: "MyGovGuide में यह योजना केवल शोध के लिए है। यह फॉर्म संदर्भ के लिए जोड़ा गया है, प्रकाशित योजना या आवेदन की गारंटी के रूप में नहीं।",
    kn: "MyGovGuide ನಲ್ಲಿ ಈ ಯೋಜನೆ ಸಂಶೋಧನೆಗೆ ಮಾತ್ರ. ಈ ಫಾರ್ಮ್ ಉಲ್ಲೇಖಕ್ಕಾಗಿ ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ, ಪ್ರಕಟಿತ ಯೋಜನೆ ಅಥವಾ ಅರ್ಜಿ ಖಾತರಿಯಾಗಿ ಅಲ್ಲ.",
  },
};
const warning = (kind, language) =>
  warningText[kind][language] || warningText[kind].en;
const hasWarning = (warnings, prefix) =>
  (warnings || []).some((value) => value.startsWith(prefix));
function UploadForm({ c, language }) {
  const input = useRef(),
    request = useRef(),
    [file, setFile] = useState(null),
    [consent, setConsent] = useState(false),
    [result, setResult] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [deleted, setDeleted] = useState(false);
  const [reference,setReference]=useState(null);
  useEffect(()=>{setReference(null);if(!result?.match)return;const abort=new AbortController();api.get('/forms/'+encodeURIComponent(result.match.formId),{params:{language},signal:abort.signal}).then(({data})=>{if(data.source.documentId===result.match.documentId)setReference(data);}).catch(()=>{});return()=>abort.abort();},[result,language]);
  useEffect(() => () => request.current?.abort(), []);
  function clear() {
    request.current?.abort();
    request.current = null;
    setBusy(false);
    setFile(null);
    setResult(null);
    setError("");
    setConsent(false);
    setDeleted(true);
    if (input.current) input.current.value = "";
  }
  async function upload(e) {
    e.preventDefault();
    if (!file || !consent) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setResult(null);
    setError("");
    setDeleted(false);
    try {
      if (
        file.size > 5 * 1024 * 1024 ||
        !["application/pdf", "image/png", "image/jpeg"].includes(file.type)
      )
        throw Error();
      const { data } = await api.post(
        "/forms/uploads/extract?consent=local-only",
        file,
        {
          headers: { "Content-Type": file.type },
          timeout: 25000,
          signal: controller.signal,
        },
      );
      if (request.current === controller) setResult(data);
    } catch (e) {
      if (e.code !== "ERR_CANCELED") setError(true);
    } finally {
      if (request.current === controller) {
        setBusy(false);
        request.current = null;
      }
    }
  }
  return (
    <section className="forms-upload" aria-labelledby="upload-title">
      <div className="forms-upload-intro">
        <Upload size={28} />
        <h2 id="upload-title">{c.upload}</h2>
        <p>{c.uploadHelp}</p>
        <p className="forms-privacy">
          <ShieldCheck size={18} />
          {c.privacy}
        </p>
      </div>
      <form onSubmit={upload}>
        <label className="forms-file-label" htmlFor="form-file">
          {c.choose}
        </label>
        <input
          ref={input}
          id="form-file"
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          disabled={busy}
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setResult(null);
            setError("");
            setDeleted(false);
          }}
        />
        <label className="forms-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>{c.consent}</span>
        </label>
        <div className="forms-actions">
          <button
            className="forms-primary"
            disabled={!file || !consent || busy}
          >
            {busy ? c.busy : c.extract}
          </button>
          <button type="button" onClick={clear}>
            {c.clear}
          </button>
        </div>
        {busy && <p role="status">{c.busy}</p>}
        {error && <p role="alert">{c.failed}</p>}
        {deleted && <p role="status">{c.deleted}</p>}
        {result && (
          <div className="forms-upload-result" role="status">
            <p>
              {result.status === "OCR_UNAVAILABLE"
                ? c.ocr
                : result.match
                  ? c.match
                  : c.unknown}
            </p>
            {result.ocr&&result.ocr!=='UNAVAILABLE'&&result.ocr!=='NOT_NEEDED'&&<p>{completionCopy(language)[result.ocr==='PARTIAL'?'ocrPartial':result.ocr==='LOW_CONFIDENCE'?'ocrLow':'ocr']}</p>}{result.match && (
              <Link to={"/forms/" + encodeURIComponent(result.match.formId)}>
                {c.open} →
              </Link>
            )}
            {result.possibleMatches?.length>0&&<div><p>{c.possible}</p>{result.possibleMatches.map(match=><p key={match.formId}><Link to={'/forms/'+encodeURIComponent(match.formId)}>{match.formId} — {match.edition}</Link></p>)}</div>}
            <ul>
              {result.fields.map((f) => (
                <li key={f.id}>
                  <span lang="en">{f.label}</span> — {c.needs}
                  <p>{formLabelHelp(f.label,language)}</p>
                </li>
              ))}
            </ul>
            {file&&<FormExperience file={file} fields={reference?.guidance?.fields?.length?reference.guidance.fields:reference?.fields?.length?reference.fields:result.fields} expectedSha={reference?.source.sha256||null} approved={!!reference?.guidance}/>}
          </div>
        )}
      </form>
    </section>
  );
}
export function Forms() {
  const { i18n } = useTranslation(),
    c = formsCopy(i18n.language),
    [state, setState] = useState({ loading: true }),
    [attempt, setAttempt] = useState(0),
    [query, setQuery] = useState(""),
    [kind, setKind] = useState("all");
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true });
    api
      .get("/forms", { signal: controller.signal })
      .then(({ data }) => setState({ data }))
      .catch((e) => {
        if (e.code !== "ERR_CANCELED") setState({ error: true });
      });
    return () => controller.abort();
  }, [attempt]);
  const items = (state.data?.items || []).filter(
    (f) =>
      (kind === "all" ||
        (kind === "checked" && f.status === "DOCUMENT_CHECKED") ||
        (kind === "reference" && f.status !== "DOCUMENT_CHECKED")) &&
      (f.title + " " + f.id + " " + f.schemeIds.join(" "))
        .normalize("NFKC")
        .toLowerCase()
        .includes(query.normalize("NFKC").toLowerCase()),
  );
  usePageVoice({
    resultType: "form",
    results: items,
    search: (q) => setQuery(q),
    sections: { summary: { text: c.intro, language: i18n.language } },
  });
  return (
    <div className="container forms-page">
      <header className="forms-heading">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1>{c.title}</h1>
        <p className="lead">{c.intro}</p>
      </header>
      <UploadForm c={c} language={i18n.language} />
      <section className="forms-frequent">
        <h2>{c.frequent}</h2>
        <p>{c.noPopularity}</p>
      </section>
      <section aria-labelledby="library-title">
        <div className="forms-library-title">
          <h2 id="library-title">{c.library}</h2>
          {state.data && (
            <span>
              {state.data.documentChecked} / {state.data.total} {c.checked}
            </span>
          )}
        </div>
        <div className="forms-filters">
          <label>
            {c.search}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label>
            {c.filter}
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="all">{c.all}</option>
              <option value="checked">{c.checked}</option>
              <option value="reference">{c.reference}</option>
            </select>
          </label>
        </div>
        {state.loading ? (
          <p role="status">{c.loading}</p>
        ) : state.error ? (
          <div role="alert">
            <p>{c.error}</p>
            <button onClick={() => setAttempt((n) => n + 1)}>{c.retry}</button>
          </div>
        ) : !items.length ? (
          <p role="status">{c.empty}</p>
        ) : (
          <div className="forms-grid">
            {items.map((f, index) => (
              <article className="forms-card" key={f.id}>
                <div className="forms-card-top">
                  <FileText size={21} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="forms-state">
                  {f.status === "DOCUMENT_CHECKED" ? c.checked : c.reference}
                </p>
                <h3>{f.title}</h3>
                {f.audience === "DISTRIBUTOR_OR_MECHANIC" && <p>{c.staff}</p>}
                {f.warnings.includes("OCR_UNAVAILABLE") && <p>{c.ocr}</p>}
                {hasWarning(f.warnings, "PRINTED_PREMIUM_OUTDATED") && (
                  <p className="forms-caution">
                    {warning("PREMIUM_OUTDATED", i18n.language)}
                  </p>
                )}
                {f.warnings.includes("SCHEME_RESEARCH_ONLY_NOT_PUBLISHED") && (
                  <p className="forms-caution">
                    {warning("RESEARCH_ONLY", i18n.language)}
                  </p>
                )}
                <Link
                  className="forms-card-link"
                  to={"/forms/" + encodeURIComponent(f.id)}
                >
                  {c.open} →
                </Link>
                <SourceLink url={f.sourceUrl}>{c.source}</SourceLink>
              </article>
            ))}
          </div>
        )}
      </section>
      <p className="forms-disclaimer">{c.disclaimer}</p>
    </div>
  );
}
export function FormDetail() {
  const { id } = useParams(),
    { i18n } = useTranslation(),
    c = formsCopy(i18n.language),
    assistant = useAssistant(),
    [state, setState] = useState({ loading: true }),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState(previous=>previous.data?.form.id===id?{...previous,data:{...previous.data,guidance:previous.data.language===i18n.language?previous.data.guidance:null},refreshing:true}:{loading:true});
    api
      .get("/forms/" + encodeURIComponent(id), {
        params: { language: i18n.language },
        signal: controller.signal,
      })
      .then(({ data }) => setState({ data }))
      .catch((e) => {
        if (e.code !== "ERR_CANCELED") setState({ error: true });
      });
    return () => controller.abort();
  }, [id, i18n.language, attempt]);
  const d = state.data,
    fields = formGuidanceFields(d),
    voiceFields = fields.map((f) => ({
      id: f.id,
      label: f.originalLabel || f.label,
      text: f.explanation || formLabelHelp(f.originalLabel||f.label,i18n.language),
      language: i18n.language,
    }));
  usePageVoice({
    results: [],
    fields: voiceFields,
    sections: {
      instructions: {
        text: voiceFields.map((f) => f.label + ": " + f.text).join(". "),
        language: i18n.language,
      },
    },
  });
  if (state.loading)
    return (
      <div className="container forms-page" role="status">
        {c.loading}
      </div>
    );
  if (state.error)
    return (
      <div className="container forms-page" role="alert">
        <h1>{c.error}</h1>
        <button onClick={() => setAttempt((n) => n + 1)}>{c.retry}</button>
        <p>
          <Link to="/forms">{c.back}</Link>
        </p>
      </div>
    );
  return (
    <article className="container forms-page form-detail">
      <Link to="/forms">← {c.back}</Link>
      <header className="forms-heading">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1>{d.guidance?.title || d.form.title}</h1>
        <p className="lead">{d.purpose || c.intro}</p>
        <div className="forms-actions">
          <SourceLink url={d.source.documentUrl || d.source.url}>
            {d.source.documentUrl ? c.download : c.source}
          </SourceLink>
          <SourceLink url={d.applicationUrl}>{c.apply}</SourceLink>
        </div>
        <dl>
          <dt>{c.edition}</dt>
          <dd>{d.source.edition || c.unknownEdition}</dd>
          <dt>{c.checkedOn}</dt>
          <dd>
            {d.source.checkedAt
              ? new Date(d.source.checkedAt).toLocaleDateString(
                  { en: "en-IN", hi: "hi-IN", kn: "kn-IN" }[i18n.language],
                )
              : c.needs}
          </dd>
        </dl>
      </header>
      {d.form.id === "FORM-18" && <p className="forms-caution">{c.staff}</p>}
      {!d.guidance && (
        <p className="forms-caution" role="note">
          {d.preparation?.aiGuidancePrepared?c.preparedPending:c.pending}
        </p>
      )}
      {d.warnings.includes('PARTIAL_FIELD_GUIDANCE_NOT_COMPLETE_FORM_INSTRUCTIONS')&&<p className="forms-caution">{c.partial}</p>}
      {d.warnings.includes("OCR_UNAVAILABLE") && (
        <p className="forms-caution">{c.ocr}</p>
      )}
      {hasWarning(d.warnings, "PRINTED_PREMIUM_OUTDATED") && (
        <p className="forms-caution">
          {warning("PREMIUM_OUTDATED", i18n.language)}
        </p>
      )}
      {d.warnings.includes("SCHEME_RESEARCH_ONLY_NOT_PUBLISHED") && (
        <p className="forms-caution">
          {warning("RESEARCH_ONLY", i18n.language)}
        </p>
      )}
      <FormExperience fields={fields} sourceUrl={d.viewer?.url||null} expectedSha={d.source.sha256} approved={!!d.guidance}/>
      <section>
        <h2>{c.original}</h2>
        {fields.length ? (
          <>
            <div className="forms-actions">
              <button
                onClick={() =>
                  assistant.speak(
                    voiceFields.map((f) => f.label + ": " + f.text).join(". "),
                    i18n.language,
                  )
                }
              >
                {c.read}
              </button>
              <button onClick={assistant.stop}>{c.stop}</button>
            </div>
            <ol className="form-fields">
              {fields.map((f, index) => (
                <li id={"field-" + f.id} key={f.id}>
                  <div className="form-field-number">{index + 1}</div>
                  <div>
                    <h3 lang="en">{f.originalLabel || f.label}</h3>
                    {!f.explanation&&<p className="forms-state">{c.generic}</p>}
                    <p>{f.explanation || formLabelHelp(f.originalLabel||f.label,i18n.language)}</p>
                    {(!d.guidance || f.needsVerification) && (
                      <p className="forms-state">{c.needs}</p>
                    )}
                    <details>
                      <summary>{c.original}</summary>
                      <blockquote lang="en">{f.sourceQuote}</blockquote>
                      {(f.originalInstruction || f.instruction) && (
                        <p lang="en">
                          {f.originalInstruction || f.instruction}
                        </p>
                      )}
                      {(f.originalCondition||f.condition)&&<p lang="en">{f.originalCondition||f.condition}</p>}
                    </details>
                    <button
                      onClick={() =>
                        (assistant.page.current.selectField?.(f.id),assistant.speak(voiceFields[index].text, i18n.language))
                      }
                    >
                      {c.read}
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p>{c.noFields}</p>
        )}
      </section>
      <section>
        <h2>{c.documents}</h2>
        {d.documents.length ? (
          <ul lang="en">
            {d.documents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{c.noDocuments}</p>
        )}
      </section>
      {d.schemes.length > 0 && (
        <section>
          <h2>{c.scheme}</h2>
          <ul>
            {d.schemes.map((s) => (
              <li key={s.id}>
                <Link to={"/schemes/" + encodeURIComponent(s.id)}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {d.guidance && (
        <ul>
          {d.guidance.limitations.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
      <p className="forms-disclaimer">{c.disclaimer}</p>
    </article>
  );
}
