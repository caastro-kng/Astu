import { lazy, Suspense, useEffect, useState } from "react";
import { Homepage } from "./components/marketing/homepage";
const FinanceApp = lazy(() =>
  import("./components/app/finance-app").then((module) => ({
    default: module.FinanceApp,
  })),
);
function RouteFocus() {
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>(".app-main h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, []);
  return null;
}
export function App() {
  const [inApp, setInApp] = useState(
    window.location.pathname.startsWith("/app"),
  );
  useEffect(() => {
    const update = () => setInApp(window.location.pathname.startsWith("/app"));
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const navigate = (url: string) => {
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
    setInApp(true);
  };
  return inApp ? (
    <Suspense
      fallback={
        <main aria-busy="true">Carregando sua organização financeira…</main>
      }
    >
      <FinanceApp />
      <RouteFocus />
    </Suspense>
  ) : (
    <Homepage onNavigate={navigate} />
  );
}
