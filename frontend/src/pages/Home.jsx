import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  Mic,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Pause,
  Compass,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Files,
  MapPin,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext.jsx";
import { useAssistant, usePageVoice } from "../context/VoiceContext.jsx";
import { stateName } from "../data/options.js";
import { Button } from "../components/ui/button.jsx";
import { api } from "../lib/api.js";
const actions = [
  ["schemes", "/schemes", Compass],
  ["eligibility", "/eligibility", ClipboardCheck],
  ["forms", "/forms", Files],
  ["notices", "/notices", FileText],
  ["scams", "/alerts", ShieldCheck],
  ["centers", "/centers", MapPin],
];
export function Home() {
  const { t, i18n } = useTranslation(),
    { profile, syncStatus } = useProfile(),
    navigate = useNavigate(),
    voice = useAssistant();
  const [query, setQuery] = useState(""),
    [attempt, setAttempt] = useState(0),
    [bannerMessage, setBannerMessage] = useState(""),
    [previews, setPreviews] = useState({
      loading: true,
      error: false,
      items: [],
    });
  useEffect(() => {
    if (["saving", "loading"].includes(syncStatus)) {
      setPreviews({ loading: true, error: false, items: [] });
      return;
    }
    const controller = new AbortController();
    setPreviews({ loading: true, error: false, items: [] });
    api
      .get("/schemes/preview", { signal: controller.signal })
      .then(({ data }) => {
        if (
          !Array.isArray(data.items) ||
          data.matching?.state !== profile.state ||
          data.matching?.category !== profile.category
        )
          throw Error("Preference mismatch");
        setPreviews({ loading: false, error: false, items: data.items });
      })
      .catch((e) => {
        if (e.code !== "ERR_CANCELED")
          setPreviews({ loading: false, error: true, items: [] });
      });
    return () => controller.abort();
  }, [profile.state, profile.category, profile.language, syncStatus, attempt]);
  usePageVoice({ results: previews.loading ? [] : previews.items });
  function search(e) {
    e.preventDefault();
    navigate(
      "/schemes" +
        (query.trim() ? "?q=" + encodeURIComponent(query.trim()) : ""),
    );
  }
  return (
    <div className="container home-page editorial-home">
      <section
        className="editorial-hero"
        aria-roledescription="carousel"
        aria-label={t("citizen.educational")}
        tabIndex={0}
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
            setBannerMessage(t("citizen.bannerPosition"));
          }
        }}
      >
        <div className="hero-copy">
          <p className="eyebrow">{t("citizen.educational")}</p>
          <h1>{t("citizen.heroTitle")}</h1>
          <p className="lead">{t("citizen.heroBody")}</p>
          <Button asChild>
            <Link to="/schemes">
              {t("citizen.explore")}
              <ArrowRight size={17} />
            </Link>
          </Button>
          <p className="hero-languages">English · हिन्दी · ಕನ್ನಡ</p>
          <small>{t("citizen.educationDate")}</small>
        </div>
        <figure className="hero-documentary">
          <img
            src="/images/india-paddy-1200.webp"
            srcSet="/images/india-paddy-640.webp 640w, /images/india-paddy-1200.webp 1200w"
            sizes="(max-width: 700px) 100vw, 50vw"
            width="1200"
            height="800"
            alt={t("citizen.photoAlt")}
          />
          <figcaption>{t("citizen.photoCaption")}</figcaption>
        </figure>
        <div className="banner-controls">
          <button aria-label={t("citizen.previousBanner")} disabled>
            <ArrowLeft size={17} />
          </button>
          <button
            className="banner-indicator"
            aria-label={t("citizen.bannerPosition")}
            aria-current="true"
            onClick={() => setBannerMessage(t("citizen.bannerPosition"))}
          >
            01 / 01
          </button>
          <button aria-label={t("citizen.nextBanner")} disabled>
            <ArrowRight size={17} />
          </button>
          <button
            aria-label={t("citizen.pause")}
            onClick={() => setBannerMessage(t("citizen.paused"))}
          >
            <Pause size={16} />
          </button>
          <span role="status">
            {bannerMessage || t("citizen.bannerPosition")}
          </span>
        </div>
      </section>
      <section
        className="editorial-recommendations"
        aria-labelledby="recommendations-title"
      >
        <div className="editorial-section-heading">
          <div>
            <p className="eyebrow">02 / {t("home.profileCaption")}</p>
            <h2 id="recommendations-title">{t("citizen.recommendations")}</h2>
          </div>
          <Link to="/settings">
            {t("common.edit")}
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="recommendation-layout">
          <aside className="preference-note">
            <p className="eyebrow">{t("home.profileCaption")}</p>
            <div className="profile-meta">
              <span>{stateName(profile.state, i18n.language)}</span>
              <span>{t("categories." + profile.category)}</span>
            </div>
            <p>{t("citizen.relevance")}</p>
            <Link to="/schemes">{t("citizen.allSchemes")} →</Link>
          </aside>
          <div>
            {previews.loading ? (
              <div className="empty-panel skeleton-panel" role="status">
                <p>{t("common.loading")}</p>
              </div>
            ) : previews.error ? (
              <div className="empty-panel" role="alert">
                <p>{t("common.unavailable")}</p>
                <Button
                  variant="outline"
                  onClick={() => setAttempt((a) => a + 1)}
                >
                  {t("common.retry")}
                </Button>
              </div>
            ) : previews.items.length ? (
              <div className="scheme-previews">
                {previews.items.map((s) => (
                  <article className="scheme-preview" key={s.id}>
                    <span className="source-badge">{t("common.reviewed")}</span>
                    <h3>
                      <Link
                        to={"/schemes/" + encodeURIComponent(s.id)}
                        lang={s.language}
                      >
                        {s.title}
                      </Link>
                    </h3>
                    {s.translationUnavailable && (
                      <p role="note">{t("schemes.fallback")}</p>
                    )}
                    <p className="scheme-snippet" lang={s.language}>
                      {s.summary}
                    </p>
                    <small>
                      {t("schemes.verified")}:{" "}
                      {new Intl.DateTimeFormat(
                        { en: "en-IN", hi: "hi-IN", kn: "kn-IN" }[
                          i18n.language
                        ],
                      ).format(new Date(s.reviewedAt))}
                    </small>
                    <Link
                      className="scheme-open"
                      to={"/schemes/" + encodeURIComponent(s.id)}
                    >
                      {t("schemes.open")}
                      <ArrowUpRight size={17} />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-panel">
                <p className="eyebrow">{t("home.emptyLabel")}</p>
                <h3>{t("home.emptyTitle")}</h3>
                <p>{t("home.emptyText")}</p>
                <Link to="/schemes">{t("citizen.allSchemes")} →</Link>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="editorial-search" aria-labelledby="home-search-title">
        <div>
          <p className="eyebrow">03 / {t("common.search")}</p>
          <h2 id="home-search-title">{t("citizen.searchTitle")}</h2>
          <p>{t("citizen.searchBody")}</p>
        </div>
        <form className="home-search" onSubmit={search}>
          <label className="sr-only" htmlFor="home-search">
            {t("home.searchLabel")}
          </label>
          <Search size={20} />
          <input
            id="home-search"
            maxLength={120}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("home.searchPlaceholder")}
          />
          <button
            type="button"
            className="voice-button"
            onClick={() => voice.setOpen(true)}
            aria-label={t("voice.start")}
          >
            <Mic size={20} />
          </button>
          <Button type="submit" aria-label={t("common.search")}>
            {t("common.search")}
            <ArrowRight size={17} />
          </Button>
        </form>
      </section>
      <section className="actions-section" aria-labelledby="actions-title">
        <div className="editorial-section-heading">
          <div>
            <p className="eyebrow">04 / {t("citizen.everyday")}</p>
            <h2 id="actions-title">{t("citizen.services")}</h2>
          </div>
        </div>
        <div className="actions-grid">
          {actions.map(([key, to, Icon], index) => (
            <Link key={key} to={to} className="action-card">
              <div className="action-card-top">
                <span className="action-number">0{index + 1}</span>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <h3>
                {t(
                  key === "centers"
                    ? "citizen.centers"
                    : "home.actions." + key + ".title",
                )}
                <ArrowUpRight size={18} />
              </h3>
              <p>
                {t(
                  key === "centers"
                    ? "citizen.centersBody"
                    : "home.actions." + key + ".description",
                )}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section className="editorial-account">
        <div>
          <p className="eyebrow">05 / MYGOVGUIDE</p>
          <h2>{t("citizen.accountTitle")}</h2>
          <p>{t("citizen.accountBody")}</p>
        </div>
        <div>
          <Button asChild variant="outline">
            <Link to="/login">
              {t("citizen.account")}
              <ArrowUpRight size={16} />
            </Link>
          </Button>
          <Link to="/schemes">{t("citizen.guest")} →</Link>
        </div>
      </section>
    </div>
  );
}
