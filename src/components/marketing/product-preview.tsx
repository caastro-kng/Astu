import {
  ArrowDownLeft,
  ArrowUpRight,
  ChartNoAxesCombined,
  LayoutDashboard,
  Target,
  Wallet,
  CalendarDays,
} from "lucide-react";
import { demo, demoBalance } from "../../data/mock-finance";
import { formatCurrency } from "../../features/finance/utils";
import { AnimatedCurrency } from "./animated-currency";

export function GoalPreview() {
  const percent = Math.round((demo.goal.current / demo.goal.target) * 100);
  return (
    <div className="mk-goal">
      <span className="mk-icon">
        <Target size={22} />
      </span>
      <div>
        <small>UM PLANO QUE GANHA FORMA</small>
        <h3>{demo.goal.name}</h3>
      </div>
      <strong>
        <AnimatedCurrency value={demo.goal.current} />{" "}
        <small>de {formatCurrency(demo.goal.target)}</small>
      </strong>
      <progress value={percent} max="100" aria-label="Progresso da meta" />
      <div className="mk-split">
        <span>{percent}% conquistado</span>
        <span>{demo.goal.deadline}</span>
      </div>
      <p>
        Aporte planejado de {formatCurrency(demo.goal.monthly)}/mês. Cada passo
        conta.
      </p>
    </div>
  );
}
export function ReportsPreview() {
  const max = Math.max(...demo.history);
  return (
    <div className="mk-report">
      <small>EVOLUÇÃO DO SALDO</small>
      <h3>Um olhar para o caminho percorrido.</h3>
      <div
        className="mk-bars"
        role="img"
        aria-label={`Saldos demonstrativos: ${demo.history.map(formatCurrency).join(", ")}`}
      >
        {demo.history.map((value, i) => (
          <div key={i}>
            <b>{formatCurrency(value)}</b>
            <i style={{ height: `${(value / max) * 130}px` }} />
            <span>{["Mai", "Jun", "Jul", "Ago", "Set"][i]}</span>
          </div>
        ))}
      </div>
      <p>Compare seus períodos e reconheça o que mudou.</p>
    </div>
  );
}
export function ProductPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mk-product ${compact ? "mk-product-compact" : ""}`}>
      <div className="mk-product-bar">
        <span className="mk-dots">● ● ●</span>
        <span>Astú / visão geral</span>
        <small>Demonstração</small>
      </div>
      <div className="mk-product-body">
        <aside aria-hidden="true">
          <img src="/brand/astu/favicon.png" width="38" height="38" alt="" />
          <LayoutDashboard />
          <Wallet />
          <CalendarDays />
          <Target />
          <ChartNoAxesCombined />
        </aside>
        <div className="mk-product-content">
          <div className="mk-split">
            <div>
              <small>SEU DINHEIRO, COM DIREÇÃO</small>
              <h3>Olá, {demo.name}</h3>
            </div>
            <span className="mk-period">{demo.period}</span>
          </div>
          <div className="mk-stats">
            <div>
              <small>Saldo disponível</small>
              <strong>{formatCurrency(demoBalance)}</strong>
              <span>Clareza para o próximo passo</span>
            </div>
            <div>
              <small>
                <ArrowUpRight size={14} /> Receitas
              </small>
              <strong>{formatCurrency(demo.income)}</strong>
            </div>
            <div>
              <small>
                <ArrowDownLeft size={14} /> Despesas
              </small>
              <strong>{formatCurrency(demo.expenses)}</strong>
            </div>
          </div>
          <div className="mk-product-panels">
            <div className="mk-transactions">
              <h4>Últimos movimentos</h4>
              {demo.transactions.map((x) => (
                <div key={x.name}>
                  <span className={`mk-icon ${x.income ? "" : "orange"}`}>
                    {x.income ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownLeft size={16} />
                    )}
                  </span>
                  <span>
                    <b>{x.name}</b>
                    <small>
                      {x.category} · {x.date}
                    </small>
                  </span>
                  <strong>
                    {x.income ? "+" : "−"} {formatCurrency(x.amount)}
                  </strong>
                </div>
              ))}
            </div>
            <GoalPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
