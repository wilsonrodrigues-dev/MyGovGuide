import {ScamAwareness} from './pages/ScamAwareness.jsx';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProfileProvider, useProfile } from "./context/ProfileContext.jsx";
import { Layout } from "./components/Layout.jsx";
import { Onboarding } from "./pages/Onboarding.jsx";
import { Home } from "./pages/Home.jsx";
import { Settings } from "./pages/Settings.jsx";
import { Upcoming } from "./pages/Upcoming.jsx";
import { HowItWorks } from "./pages/HowItWorks.jsx";
import { Schemes } from "./pages/Schemes.jsx";
import { SchemeDetail } from "./pages/SchemeDetail.jsx";
import { Button } from "./components/ui/button.jsx";
import { VoiceProvider } from "./context/VoiceContext.jsx";
import { Information } from "./pages/Information.jsx";
import { Forms, FormDetail } from "./pages/Forms.jsx";
import { lazy, Suspense } from "react";
import {Notices} from "./pages/Notices.jsx";
import {Eligibility} from "./pages/Eligibility.jsx";
const AdminApp = lazy(() =>
  import("./admin/AdminApp.jsx").then((m) => ({ default: m.AdminApp })),
);

function Guard() {
  const { profile } = useProfile();
  return profile ? <Outlet /> : <Navigate to="/onboarding" replace />;
}

function Index() {
  const { profile } = useProfile();
  return <Navigate to={profile ? "/home" : "/onboarding"} replace />;
}

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container future-page">
      <h1>{t("notFound.title")}</h1>
      <p className="lead">{t("notFound.body")}</p>
      <Button asChild>
        <Link to="/home">{t("common.back")}</Link>
      </Button>
    </div>
  );
}

const futureRoutes = {
  centers: "centers",

  notifications: "notifications",
  bookmarks: "bookmarks",
  login: "login",
};

function CitizenApp() {
  return (
    <ProfileProvider>
      <VoiceProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="schemes" element={<Schemes />} />
            <Route path="schemes/:id" element={<SchemeDetail />} />
            <Route path="notices" element={<Notices />} />
            <Route path="notice" element={<Notices />} />
            <Route path="notice/checklist" element={<Notices />} />
            <Route path="eligibility" element={<Eligibility />} />
            <Route path="eligibility/results" element={<Navigate to="/eligibility" replace />} />
            <Route path="eligibility/:schemeId" element={<Eligibility />} />
            <Route path="forms" element={<Forms />} /><Route path="alerts" element={<ScamAwareness />} /><Route path="alerts/:id" element={<ScamAwareness />} /><Route path="scams" element={<ScamAwareness />} /><Route path="scams/:id" element={<ScamAwareness />} />
            <Route path="forms/:id" element={<FormDetail />} />
            <Route path="privacy" element={<Information kind="privacy" />} />
            <Route path="help" element={<Information kind="help" />} />
            <Route element={<Guard />}>
              <Route path="home" element={<Home />} />
              <Route path="settings" element={<Settings />} />
              {Object.entries(futureRoutes).map(([route, feature]) => (
                <Route
                  key={route}
                  path={route}
                  element={<Upcoming feature={feature} />}
                />
              ))}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </VoiceProvider>
    </ProfileProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div role="status">Loading workspace…</div>}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<CitizenApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
