import { lazy, Suspense } from "react";
import { Homepage } from "./components/marketing/homepage";
const FinanceApp = lazy(() =>
  import("./components/app/finance-app").then((module) => ({
    default: module.FinanceApp,
  })),
);
export function App() {
  return window.location.pathname.startsWith("/app") ? (
    <Suspense
      fallback={
        <main aria-busy="true">Carregando sua organização financeira…</main>
      }
    >
      <FinanceApp />
    </Suspense>
  ) : (
    <Homepage />
  );
}
