import { BrowserRouter,Routes,Route,Navigate,Outlet,Link,} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProfileProvider, useProfile } from "./context/ProfileContext.jsx";
import { Layout } from "./components/Layout.jsx";
import { Onboarding } from "./pages/Onboarding.jsx";
import { Home } from "./pages/Home.jsx";
import { Settings } from "./pages/Settings.jsx";
import { Upcoming } from "./pages/Upcoming.jsx";
import { HowItWorks } from "./pages/HowItWorks.jsx";
import { Schemes } from './pages/Schemes.jsx';
import { SchemeDetail } from './pages/SchemeDetail.jsx';
import { Button } from "./components/ui/button.jsx";
import { lazy, Suspense } from "react";
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
  eligibility: "eligibility",
  "eligibility/results": "results",
  forms: "forms",
  "forms/:id": "guidance",
  notice: "notices",
  "notice/checklist": "checklist",
  alerts: "scams",
  notifications: "notifications",
  bookmarks: "bookmarks",
  login: "login",
};

function CitizenApp() {
  return (
    <ProfileProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="schemes/:id" element={<SchemeDetail />} />
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
