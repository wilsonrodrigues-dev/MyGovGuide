import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PreferenceForm } from "../components/PreferenceForm.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
export function Settings() {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const navigate = useNavigate();
  return (
    <div className="container settings-page">
      <p className="eyebrow">{t("settings.eyebrow")}</p>
      <h1>{t("settings.title")}</h1>
      <p className="lead">{t("settings.subtitle")}</p>
      <section className="settings-card">
        <PreferenceForm
          initial={profile}
          editing
          onSaved={() => navigate("/home")}
        />
      </section>
    </div>
  );
}
