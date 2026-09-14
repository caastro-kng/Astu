import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  Flag,
  Home,
  Plus,
  ReceiptText,
  Target,
  Wallet,
} from "lucide-react";
import {
  phoneDemoData,
  phoneDemoUpdatedBalance,
  phoneDemoUpdatedExpenses,
} from "../../data/mock-finance";
import { formatCurrency } from "../../features/finance/utils";

function PhoneBottomNavigation({ goals = false }: { goals?: boolean }) {
  return (
    <nav className="mk-phone-nav" aria-label="Navegação demonstrativa">
      <span className={goals ? "" : "active"}><Home />Início</span>
      <span><ReceiptText />Registros</span>
      <span className={goals ? "active" : ""} data-phone-goals><Target />Metas</span>
    </nav>
  );
}

export function PhoneHomeScreen() {
  return (
    <div className="mk-phone-screen mk-phone-home" data-phone-home>
      <div className="mk-phone-home-time">09:41</div>
      <div className="mk-phone-home-icons">
        <span /><span /><span />
        <button type="button" data-phone-icon tabIndex={-1} aria-label="Abrir Astú">
          <img src="/brand/astu/astu-app-icon.png" width="58" height="58" alt="" />
          <b>Astú</b>
        </button>
        <span /><span /><span /><span />
      </div>
    </div>
  );
}

export function AstuSplashScreen() {
  return (
    <div className="mk-phone-screen mk-phone-splash" data-phone-splash>
      <img src="/brand/astu/favicon.png" width="84" height="84" alt="" />
      <strong>Astú<span>.</span></strong>
      <small>Clareza para decidir melhor.</small>
    </div>
  );
}

function MiniChart({ updated = false }: { updated?: boolean }) {
  return (
    <div className={`mk-phone-chart ${updated ? "updated" : ""}`} data-phone-chart>
      {[42, 62, 49, 78, 68, updated ? 88 : 73].map((height, index) => (
        <i key={`${height}-${index}`} data-phone-chart-bar={index === 5 ? "last" : undefined} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

export function MobileOverviewDemo({ updated = false }: { updated?: boolean }) {
  const balance = updated ? phoneDemoUpdatedBalance : phoneDemoData.initialBalance;
  const expenses = updated ? phoneDemoUpdatedExpenses : phoneDemoData.initialExpenses;
  return (
    <div className={`mk-phone-screen mk-phone-overview ${updated ? "is-updated" : ""}`} data-phone-overview>
      <header><img src="/brand/astu/favicon.png" width="30" height="30" alt="" /><span><small>Olá, Camila</small><b>Seu mês em perspectiva</b></span></header>
      <article className="mk-phone-balance" data-phone-card><small>Saldo disponível</small><strong><span data-value-initial>{formatCurrency(phoneDemoData.initialBalance)}</span><span data-value-updated>{formatCurrency(balance)}</span></strong><span>Setembro</span></article>
      <div className="mk-phone-metrics" data-phone-card>
        <span><ArrowUp /><small>Receitas</small><b>{formatCurrency(480000)}</b></span>
        <span><ArrowDown /><small>Despesas</small><b><span data-value-initial>{formatCurrency(phoneDemoData.initialExpenses)}</span><span data-value-updated>{formatCurrency(expenses)}</span></b></span>
      </div>
      <section className="mk-phone-chart-card" data-phone-card><small>Resumo do mês</small><MiniChart updated={updated} /></section>
      <article className="mk-phone-next" data-phone-card><CalendarDays /><span><small>Próxima conta</small><b>{phoneDemoData.nextBill.name}</b></span><strong>{formatCurrency(phoneDemoData.nextBill.amount)}</strong></article>
      <article className="mk-phone-new-row" data-phone-new-row><Check /><span><b>{phoneDemoData.expenseDescription}</b><small>{phoneDemoData.expenseCategory}</small></span><strong>− {formatCurrency(phoneDemoData.demonstrationExpense)}</strong></article>
      <button className="mk-phone-add" type="button" tabIndex={-1} data-phone-add aria-label="Nova transação"><Plus /></button>
      <PhoneBottomNavigation />
    </div>
  );
}

export function TransactionDemo() {
  return (
    <div className="mk-phone-sheet" data-phone-sheet>
      <i />
      <small>NOVA MOVIMENTAÇÃO</small>
      <h3>Registrar despesa</h3>
      <label data-phone-field>Descrição <span>{phoneDemoData.expenseDescription}</span></label>
      <label data-phone-field>Categoria <span>{phoneDemoData.expenseCategory}</span></label>
      <label data-phone-field>Valor <span>{formatCurrency(phoneDemoData.demonstrationExpense)}</span></label>
      <button type="button" tabIndex={-1} data-phone-save>Salvar despesa</button>
    </div>
  );
}

export function GoalDemo() {
  const percent = Math.round((phoneDemoData.goal.current / phoneDemoData.goal.target) * 100);
  return (
    <div className="mk-phone-screen mk-phone-goal" data-phone-goal>
      <header><span><small>METAS</small><b>Seus planos em movimento</b></span><Flag /></header>
      <article><span className="mk-goal-icon"><Wallet /></span><small>MINHA META</small><h3>{phoneDemoData.goal.name}</h3><strong>{percent}%</strong><progress data-phone-goal-progress value={percent} max={100} aria-label={`${percent}% da meta`} /><div><b>{formatCurrency(phoneDemoData.goal.current)}</b><small>de {formatCurrency(phoneDemoData.goal.target)}</small></div><p>Você já percorreu <b>{percent}%</b> do caminho.</p></article>
      <PhoneBottomNavigation goals />
    </div>
  );
}

export function TapIndicator() {
  return <span className="mk-tap-indicator" data-phone-tap aria-hidden="true"><i /></span>;
}

export function PhoneFrame() {
  return (
    <div className="mk-phone-wrap" data-phone-frame>
      <div className="mk-phone-glow" data-phone-glow />
      <div className="mk-phone-frame">
        <span className="mk-phone-island" />
        <div className="mk-phone-viewport">
          <PhoneHomeScreen />
          <AstuSplashScreen />
          <MobileOverviewDemo />
          <GoalDemo />
          <TransactionDemo />
          <div className="mk-phone-toast" data-phone-toast><Check /> Despesa salva</div>
          <TapIndicator />
        </div>
      </div>
    </div>
  );
}

export function StaticPhoneScene({ type }: { type: "overview" | "transaction" | "goal" }) {
  return (
    <div className={`mk-phone-frame mk-phone-static ${type}`}>
      <span className="mk-phone-island" />
      <div className="mk-phone-viewport">
        {type === "goal" ? <GoalDemo /> : <MobileOverviewDemo updated={type === "transaction"} />}
        {type === "transaction" ? <TransactionDemo /> : null}
      </div>
    </div>
  );
}
