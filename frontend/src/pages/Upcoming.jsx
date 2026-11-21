import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Construction, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button.jsx";
export function Upcoming({ feature }) {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  return (
    <div className="container future-page">
      <span className="future-icon" aria-hidden="true">
        <Construction size={32} strokeWidth={1.4} />
      </span>
      <span className="status-pill">{t("common.coming")}</span>
      <p className="eyebrow">
        {t(feature === "centers" ? "citizen.centers" : `future.${feature}`)}
      </p>
      <h1>{t("citizen.limited")}</h1>
      <p className="lead">
        {t(
          feature === "centers"
            ? "citizen.centersLimited"
            : feature === "login"
              ? "citizen.accountBody"
              : "future.body",
        )}
      </p>
      {params.get("q") && (
        <p className="search-summary">
          {t("future.search")}: <strong>{params.get("q").slice(0, 120)}</strong>
        </p>
      )}
      <p className="future-status">
        <ShieldCheck size={17} aria-hidden="true" />
        {t(
          feature === "eligibility" || feature === "results"
            ? "future.noDecision"
            : "future.status",
        )}
      </p>
      <Button asChild>
        <Link to="/home">
          <ArrowLeft size={17} aria-hidden="true" />
          {t("common.back")}
        </Link>
      </Button>
    </div>
  );
}
