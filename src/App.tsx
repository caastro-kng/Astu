import { lazy, Suspense, useEffect, useState } from "react";
import { Homepage } from "./components/marketing/homepage";

const FinanceApp = lazy(() =>
  import("./components/app/finance-app").then((module) => ({
    default: module.FinanceApp,
  })),
);

const FinanceDashboardApp = lazy(() =>
  import("./components/app/finance-dashboard-app").then((module) => ({
    default: module.FinanceDashboardApp,
  })),
);

function RouteFocus() {
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>(".finance-main h1, .app-main h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, []);
  return null;
}

export function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  const navigate = (url: string) => {
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
    setPath(url);
  };

  const inApp = path.startsWith("/app");
  const isOverview = path === "/app" || path === "/app/";

  if (!inApp) return <Homepage onNavigate={navigate} />;

  return (
    <Suspense
      fallback={
        <main aria-busy="true">Carregando sua organização financeira…</main>
      }
    >
      {isOverview ? <FinanceDashboardApp /> : <FinanceApp />}
      <RouteFocus />
    </Suspense>
  );
}
