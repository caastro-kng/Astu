import { AstuHero } from "./components/astu/astu-hero"
import { FinanceApp } from "./components/app/finance-app"
export function App(){return window.location.pathname.startsWith("/app")?<FinanceApp/>:<AstuHero dashboardTargetId="app"/>}
