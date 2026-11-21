import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {formsCopy} from '../i18n/forms.js';
export function Information({ kind }) {
  const { t,i18n } = useTranslation(),forms=formsCopy(i18n.language);
  return (
    <div className="container scheme-page">
      <p className="eyebrow">MYGOVGUIDE</p>
      <h1>
        {t(kind === "privacy" ? "citizen.privacy" : "citizen.accessibility")}
      </h1>
      <p className="lead">
        {t(kind === "privacy" ? "citizen.privacyBody" : "citizen.helpBody")}
      </p>
      <p>{t("common.notGovernment")}</p>
      {kind==='privacy'&&<section><h2>{forms.upload}</h2><p>{forms.privacy}</p><p>{forms.retention}</p><p>{forms.uploadHelp}</p></section>}
      <Link to="/home">{t("common.back")} →</Link>
    </div>
  );
}
