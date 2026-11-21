import {completionCopy} from '../i18n/completion.js';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import { Button } from "../components/ui/button.jsx";
import { ReadAloud } from "../components/ReadAloud.jsx";
import { usePageVoice } from "../context/VoiceContext.jsx";
import { formsCopy } from "../i18n/forms.js";
export function SchemeDetail() {
  const [forms, setForms] = useState([]);
  const { id } = useParams(),
    { t, i18n } = useTranslation(),
    [attempt, setAttempt] = useState(0),
    [state, setState] = useState({ loading: true });
  const explanation = state.data?.explanation,
    language = state.data?.language;
  useEffect(() => {
    const controller = new AbortController();
    setForms([]);
    api
      .get("/forms", { params: { schemeId: id }, signal: controller.signal })
      .then(({ data }) =>
        setForms(
          data.items.filter(
            (f) =>
              f.status === "DOCUMENT_CHECKED" &&
              f.audience === "CITIZEN" &&
              f.id !== "FORM-02",
          ),
        ),
      )
      .catch(() => {});
    return () => controller.abort();
  }, [id]);
  usePageVoice({
    results: [],
    sections: explanation
      ? {
          summary: { text: explanation.summary, language },
          benefits: { text: explanation.benefits.join(". "), language },
          documents: {
            text: explanation.documents.length
              ? explanation.documents
                  .map((d) => d.label + ": " + d.explanation)
                  .join(". ")
              : t("schemes.noDocuments"),
            language: explanation.documents.length ? language : i18n.language,
          },
          apply: { text: explanation.howToApply.steps.join(". "), language },
        }
      : {},
  });
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true });
    api
      .get("/content/schemes/" + encodeURIComponent(id), {
        params: { language: i18n.language },
        signal: controller.signal,
      })
      .then(({ data }) => setState({ data }))
      .catch((e) => {
        if (e.code !== "ERR_CANCELED")
          setState({ missing: e.response?.status === 404, error: true });
      });
    return () => controller.abort();
  }, [id, i18n.language, attempt]);
  const date = (v) =>
    v && !Number.isNaN(new Date(v).valueOf())
      ? new Intl.DateTimeFormat(
          { en: "en-IN", hi: "hi-IN", kn: "kn-IN" }[i18n.language],
        ).format(new Date(v))
      : t("schemes.unknownDate");
  if (state.loading)
    return (
      <div className="container scheme-page" role="status">
        {t("common.loading")}
      </div>
    );
  if (state.error)
    return (
      <div className="container scheme-page">
        <h1>{t(state.missing ? "schemes.unavailable" : "schemes.error")}</h1>
        <p>{t("schemes.unavailableHelp")}</p>
        {!state.missing && (
          <Button onClick={() => setAttempt((n) => n + 1)}>
            {t("common.retry")}
          </Button>
        )}
        <p>
          <Link to="/schemes">{t("schemes.back")}</Link>
        </p>
      </div>
    );
  const d = state.data,
    o = d.explanation;
  return (
    <article className="container scheme-page scheme-detail">
      <Link to="/schemes">{t("schemes.back")}</Link>
      <header>
        <p className="eyebrow">{t("common.reviewed")}</p>
        <h1 lang={d.language}>{o.title}</h1>
        {d.translationUnavailable && (
          <p className="scheme-caution" role="note">
            {t("schemes.fallback")}
          </p>
        )}
        <h2 className="detail-intro-label">{t("citizen.simpleExplanation")}</h2>
        <p className="lead" lang={d.language}>
          {o.summary}
        </p>
        <p>{t("schemes.reviewed")}</p>
        {!d.translationUnavailable && (
          <ReadAloud language={d.language} text={o.title + ". " + o.summary} />
        )}
      </header>
      <section>
        <h2>{t("schemes.benefits")}</h2>
        <ul lang={d.language}>
          {o.benefits.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>{t("schemes.eligibility")}</h2>
        <Link className="text-link" to={'/eligibility/'+encodeURIComponent(id)}>{completionCopy(i18n.language).check} →</Link>
        <h3>{t("schemes.audience")}</h3>
        <p lang={d.language}>{o.whoItMayHelp}</p>
        <p className="scheme-caution">{t("schemes.noVerdict")}</p>
      </section>
      <section>
        <h2>{t("schemes.documents")}</h2>
        {o.documents.length ? (
          <ul lang={d.language}>
            {o.documents.map((doc, i) => (
              <li key={i}>
                <strong>{doc.label}</strong>: {doc.explanation}
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("schemes.noDocuments")}</p>
        )}
      </section>
      <section>
        <h2>{t("schemes.apply")}</h2>
        <ol lang={d.language}>
          {o.howToApply.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <p>{t("schemes.leaving")}</p>
        <ul lang={d.language}>
          {o.howToApply.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
      {forms.length > 0 && (
        <section>
          <h2>{formsCopy(i18n.language).eyebrow}</h2>
          <ul>
            {forms.map((f) => (
              <li key={f.id}>
                <Link to={"/forms/" + encodeURIComponent(f.id)}>{f.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="scheme-caution">
        <h2>{t("schemes.limitations")}</h2>
        <ul lang={d.language}>
          {o.limitations.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>{t("schemes.source")}</h2>
        <a href={d.source.url} target="_blank" rel="noopener noreferrer">
          {t("common.source")} ↗
        </a>
        <details className="original-evidence">
          <summary>{t("schemes.source")}</summary>
          <blockquote>{d.source.excerpt}</blockquote>
        </details>
        <dl>
          {d.scheme?.authority && (
            <>
              <dt>{t("schemes.authority")}</dt>
              <dd>{d.scheme.authority}</dd>
            </>
          )}
          <dt>{t("schemes.verified")}</dt>
          <dd>{date(d.source.verifiedAt)}</dd>
          <dt>{t("schemes.published")}</dt>
          <dd>{date(d.source.publishedAt)}</dd>
        </dl>
      </section>
    </article>
  );
}
