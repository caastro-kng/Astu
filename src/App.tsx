import { useEffect, useState } from "react";
import { Homepage } from "./components/marketing/homepage";

import { FinanceApp } from "./components/app/finance-app";
import { FinanceDashboardApp } from "./components/app/finance-dashboard-app";

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
    <div className="finance-route-transition" key={isOverview ? "overview" : path}>
      {isOverview ? <FinanceDashboardApp /> : <FinanceApp />}
      <RouteFocus />
    </div>
  );
}
