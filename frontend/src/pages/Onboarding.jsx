import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Volume2, ArrowRight, Mic } from "lucide-react";
import { PreferenceForm } from "../components/PreferenceForm.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import { useAssistant, usePageVoice } from "../context/VoiceContext.jsx";
import { languageNames } from "../data/options.js";
export function Onboarding() {
  const { t, i18n } = useTranslation(),
    navigate = useNavigate(),
    { profile, changeLanguage } = useProfile(),
    voice = useAssistant(),
    [chosen, setChosen] = useState(false),
    [mode, setMode] = useState("manual"),
    [keepVoice, setKeepVoice] = useState(false);
  usePageVoice(
    chosen ? null : { results: [], onLanguageSelected: () => setChosen(true) },
  );
  if (profile) return <Navigate to="/home" replace />;
  return (
    <div className="container editorial-onboarding">
      <section>
        <p className="eyebrow">MYGOVGUIDE / 01</p>
        <h1>{t("citizen.languageFirst")}</h1>
        <p className="lead">{t("citizen.introduction")}</p>
        <div
          className="language-tiles"
          role="group"
          aria-label={t("common.language")}
        >
          {Object.entries(languageNames).map(([language, name]) => (
            <button
              key={language}
              lang={language}
              aria-label={t("citizen.chooseLanguage", { language: name })}
              aria-pressed={chosen && i18n.language === language}
              onClick={() => {
                changeLanguage(language);
                setChosen(true);
              }}
            >
              <strong>{name}</strong>
              <span>
                {language === "en"
                  ? "Continue in English"
                  : language === "hi"
                    ? "हिन्दी में आगे बढ़ें"
                    : "ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ"}
              </span>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
        <button
          className="text-control"
          onClick={() =>
            voice.speak(
              "Choose English, Hindi, or Kannada. Select your language on the screen.",
              "en",
            )
          }
        >
          <Volume2 size={18} />
          {t("citizen.hearChoices")}
        </button>
        {chosen && (
          <section
            className="onboarding-details"
            aria-label={t("citizen.method")}
          >
            <h2>{t("citizen.method")}</h2>
            <div className="method-choice">
              <button
                aria-pressed={mode === "manual"}
                onClick={() => {
                  setMode("manual");
                  voice.disable();
                  setKeepVoice(false);
                }}
              >
                {t("citizen.manual")}
              </button>
              <button
                aria-pressed={mode === "voice"}
                onClick={() => {
                  setMode("voice");
                  voice.enable();
                  voice.speak(t("citizen.statePrompt"));
                }}
              >
                <Mic size={17} />
                {t("citizen.guided")}
              </button>
            </div>
            {mode === "voice" && (
              <div className="guidance-note">
                <p>{t("citizen.guidance")}</p>
                <button className="text-control" onClick={voice.listen}>
                  <Mic size={16} />
                  {t("citizen.listen")}
                </button>
              </div>
            )}
            <PreferenceForm
              voiceGuidance={mode === "voice"}
              onSaved={() => {
                if (keepVoice) voice.enable();
                else voice.disable();
                navigate("/home", { replace: true });
              }}
              extra={
                <label className="voice-preference">
                  <input
                    type="checkbox"
                    checked={keepVoice}
                    onChange={(e) => setKeepVoice(e.target.checked)}
                  />
                  {t("citizen.voicePreference")}
                </label>
              }
            />
          </section>
        )}
        <p className="onboarding-private">{t("citizen.noPrivateDetails")}</p>
      </section>
      <aside className="onboarding-photo">
        <img
          src="/images/india-paddy-640.webp"
          srcSet="/images/india-paddy-640.webp 640w, /images/india-paddy-1200.webp 1200w"
          sizes="(max-width: 800px) 100vw, 38vw"
          width="640"
          height="640"
          alt={t("citizen.photoAlt")}
        />
        <div>
          <span className="eyebrow">ENGLISH / हिन्दी / ಕನ್ನಡ</span>
          <h2>{t("onboarding.trustTitle")}</h2>
          <p>{t("onboarding.trustText")}</p>
          <small>{t("citizen.photoCaption")}</small>
        </div>
      </aside>
    </div>
  );
}
