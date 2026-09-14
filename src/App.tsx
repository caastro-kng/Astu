import { AstuHero } from "./components/astu/astu-hero"
import { FinancialDashboard } from "./components/astu/financial-dashboard"
export function App(){return <><AstuHero/><main><section id="financial-dashboard" className="dashboard-shell" aria-labelledby="dashboard-title"><FinancialDashboard/></section></main></>}
