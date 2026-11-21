import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import { useProfile } from "../context/ProfileContext.jsx";
import { states, categories, stateName } from "../data/options.js";
import { Button } from "../components/ui/button.jsx";
import { usePageVoice } from "../context/VoiceContext.jsx";
export function Schemes() {
  const { t, i18n } = useTranslation(),
    { profile } = useProfile(),
    [params, setParams] = useSearchParams();
  const q = params.get("q") || "",
    state = params.get("state") || "",
    category = params.get("category") || "";
  const page = Math.max(
    1,
    Math.min(10000, Math.trunc(Number(params.get("page")) || 1)),
  );
  const [draft, setDraft] = useState(q),
    [attempt, setAttempt] = useState(0),
    [result, setResult] = useState({ loading: true, items: [], error: false });
  usePageVoice({ results: result.loading ? [] : result.items });
  useEffect(() => setDraft(q), [q]);
  useEffect(() => {
    const controller = new AbortController();
    setResult({ loading: true, items: [], error: false });
    api
      .get("/content/search", {
        params: {
          q,
          language: i18n.language,
          ...(state ? { state } : {}),
          ...(category ? { category } : {}),
          limit: 12,
          page,
        },
        signal: controller.signal,
      })
      .then(({ data }) =>
        setResult({ ...data, loading: false, items: data.items, error: false }),
      )
      .catch((e) => {
        if (e.code !== "ERR_CANCELED")
          setResult({ loading: false, items: [], error: true });
      });
    return () => controller.abort();
  }, [q, state, category, page, i18n.language, attempt]);
  function submit(e) {
    e.preventDefault();
    const values = new FormData(e.currentTarget);
    setParams(Object.fromEntries([...values].filter(([, v]) => v.trim())));
  }
  return (
    <div className="container scheme-page">
      <header>
        <p className="eyebrow">{t("common.reviewed")}</p>
        <h1>{t("schemes.title")}</h1>
        <p className="lead">{t("schemes.intro")}</p>
      </header>
      <div
        className="scheme-tabs"
        role="group"
        aria-label={t("schemes.results")}
      >
        <Button
          type="button"
          variant={!state && !category ? "default" : "outline"}
          aria-pressed={!state && !category}
          onClick={() => setParams({})}
        >
          {t("citizen.allSchemes")}
        </Button>
        {profile && (
          <Button
            type="button"
            variant={
              state === profile.state && category === profile.category
                ? "default"
                : "outline"
            }
            aria-pressed={
              state === profile.state && category === profile.category
            }
            onClick={() =>
              setParams({ state: profile.state, category: profile.category })
            }
          >
            {t("citizen.recommendedTab")}
          </Button>
        )}
      </div>
      <form className="scheme-filters" onSubmit={submit}>
        <label>
          {t("schemes.query")}
          <input
            name="q"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={120}
            aria-describedby="scheme-search-hint"
          />
        </label>
        <label>
          {t("schemes.state")}
          <select name="state" key={"state" + state} defaultValue={state}>
            <option value="">{t("schemes.all")}</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {stateName(s, i18n.language)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("schemes.category")}
          <select
            name="category"
            key={"category" + category}
            defaultValue={category}
          >
            <option value="">{t("schemes.all")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {t("categories." + c)}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit">{t("common.search")}</Button>
        <p id="scheme-search-hint">{t("schemes.hint")}</p>
        <div className="scheme-filter-actions">
          <Button variant="outline" type="button" onClick={() => setParams({})}>
            {t("schemes.clear")}
          </Button>
          {profile && (
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                setParams({ state: profile.state, category: profile.category })
              }
            >
              {t("schemes.forMe")}
            </Button>
          )}
        </div>
      </form>
      <section aria-label={t("schemes.results")} aria-busy={result.loading}>
        {result.loading ? (
          <p role="status">{t("common.loading")}</p>
        ) : result.error ? (
          <div className="empty-panel" role="alert">
            <p>{t("schemes.error")}</p>
            <Button onClick={() => setAttempt((n) => n + 1)}>
              {t("common.retry")}
            </Button>
          </div>
        ) : !result.items.length ? (
          <div className="empty-panel" role="status">
            <h2>{t("schemes.empty")}</h2>
            <p>{t("schemes.emptyHelp")}</p>
          </div>
        ) : (
          <div className="scheme-results">
            {result.items.map((s) => (
              <article className="scheme-result" key={s.id}>
                <span className="source-badge">{t("common.reviewed")}</span>
                <h2>
                  <Link
                    to={"/schemes/" + encodeURIComponent(s.id)}
                    lang={s.language}
                  >
                    {s.title}
                  </Link>
                </h2>
                {s.translationUnavailable && (
                  <p role="note">{t("schemes.fallback")}</p>
                )}
                <p lang={s.language}>{s.summary}</p>
                <p>{stateName(s.state, i18n.language)}</p>
                <p className="scheme-caution">{t("schemes.noVerdict")}</p>
                <Link to={"/schemes/" + encodeURIComponent(s.id)}>
                  {t("schemes.open")}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
      {!result.loading && !result.error && result.total > 0 && (
        <nav
          className="scheme-filter-actions"
          aria-label={t("schemes.pagination")}
        >
          <p role="status">
            {t("schemes.resultCount", { count: result.total })} ·{" "}
            {t("schemes.pageLabel", { page, total: result.totalPages })}
          </p>
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() =>
              setParams((previous) => {
                const next = new URLSearchParams(previous);
                next.set("page", String(page - 1));
                return next;
              })
            }
          >
            {t("schemes.previous")}
          </Button>
          <Button
            variant="outline"
            disabled={!result.hasNext}
            onClick={() =>
              setParams((previous) => {
                const next = new URLSearchParams(previous);
                next.set("page", String(page + 1));
                return next;
              })
            }
          >
            {t("schemes.next")}
          </Button>
        </nav>
      )}
    </div>
  );
}
