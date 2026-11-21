import { Compass, BookOpen, ExternalLink, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ReadAloud } from "../components/ReadAloud.jsx";
export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <div className="container how-page">
      <p className="eyebrow">{t("how.eyebrow")}</p>
      <h1>{t("how.title")}</h1>
      <p className="lead">{t("how.subtitle")}</p>
      <ReadAloud
        text={`${t("how.title")} ${t("how.subtitle")} ${t("how.first")} ${t("how.second")} ${t("how.third")}`}
      />
      <div className="how-grid">
        {[
          ["first", Compass],
          ["second", BookOpen],
          ["third", ExternalLink],
          ["voice", Languages],
        ].map(([key, Icon], index) => (
          <article key={key}>
            <span className="how-number">0{index + 1}</span>
            <Icon size={25} aria-hidden="true" />
            <h2>{t(`how.${key}Title`)}</h2>
            <p>{t(`how.${key}`)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
