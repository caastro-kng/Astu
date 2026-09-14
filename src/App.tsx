import { lazy, Suspense } from "react"
import { AstuHero } from "./components/astu/astu-hero"
const FinanceApp = lazy(() => import("./components/app/finance-app").then(module => ({ default: module.FinanceApp })))
export function App(){return window.location.pathname.startsWith("/app")?<Suspense fallback={<main aria-busy="true"/>}><FinanceApp/></Suspense>:<AstuHero dashboardTargetId="app"/>}
