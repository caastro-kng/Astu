import {
  CalendarDays,
  Flag,
  LayoutDashboard,
  ReceiptText,
  Wallet,
} from "lucide-react";
import { demo, demoBalance } from "../../data/mock-finance";
import { formatCurrency } from "../../features/finance/utils";

const summary = [
  { label: "Receitas", value: demo.income, tone: "mint" },
  { label: "Despesas", value: demo.expenses, tone: "orange" },
];

export function OrganizationPreview() {
  const percent = Math.round((demo.goal.current / demo.goal.target) * 100);
  return (
    <div className="mk-organizer" data-organizer-window>
      <div className="mk-organizer-bar">
        <span>● ● ●</span>
        <small>Astú / organização financeira</small>
        <b>Demonstração</b>
      </div>
      <div className="mk-organizer-shell">
        <aside data-organizer-sidebar aria-hidden="true">
          <img src="/brand/astu/favicon.png" width="38" height="38" alt="" />
          <LayoutDashboard />
          <Wallet />
          <CalendarDays />
          <Flag />
        </aside>
        <div className="mk-organizer-main">
          <header>
            <span>VISÃO DO MÊS</span>
            <strong>Setembro</strong>
          </header>
          <div className="mk-organizer-grid">
            {summary.map((item) => (
              <article
                className={`mk-organizer-card ${item.tone}`}
                data-organizer-card
                key={item.label}
              >
                <small>{item.label}</small>
                <strong>{formatCurrency(item.value)}</strong>
              </article>
            ))}
            <div className="mk-organizer-fox" data-organizer-fox>
              <img
                src="/brand/astu/astu-mascot.png"
                width="1254"
                height="1254"
                alt="Raposa Astú acompanhando a organização das finanças"
              />
              <span>Agora cada número tem seu lugar.</span>
            </div>
            <article className="mk-organizer-card compact" data-organizer-card>
              <ReceiptText size={18} />
              <span>
                <small>Próxima conta</small>
                <b>Internet · 18 set</b>
              </span>
              <strong>{formatCurrency(demo.subscriptions[0].amount)}</strong>
            </article>
            <article className="mk-organizer-card compact" data-organizer-card>
              <Wallet size={18} />
              <span>
                <small>Saldo disponível</small>
                <b>Pronto para planejar</b>
              </span>
              <strong>{formatCurrency(demoBalance)}</strong>
            </article>
            <article className="mk-organizer-goal" data-organizer-card>
              <span>
                <small>Meta em andamento</small>
                <b>{demo.goal.name}</b>
              </span>
              <strong>{percent}%</strong>
              <progress
                value={percent}
                max={100}
                aria-label={`${percent}% da meta demonstrativa`}
              />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
