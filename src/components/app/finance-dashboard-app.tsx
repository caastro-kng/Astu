import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Menu,
  Plus,
  Repeat2,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import { useFinance } from "../../features/finance/use-finance";
import type { TransactionType } from "../../features/finance/types";
import {
  activeMonthly,
  formatCurrency,
  id,
  today,
  totals,
} from "../../features/finance/utils";
import "./finance-dashboard.css";

const nav = [
  ["/app", "Visão geral", LayoutDashboard],
  ["/app/movimentos", "Receitas e despesas", Wallet],
  ["/app/assinaturas", "Assinaturas", Repeat2],
  ["/app/metas", "Metas", Target],
  ["/app/relatorios", "Relatórios", TrendingUp],
] as const;

const categories = [
  "Casa",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Assinaturas",
  "Outros",
  "Salário",
  "Renda extra",
];

type EntryForm = {
  type: TransactionType;
  description: string;
  amount: string;
  category: string;
  date: string;
};

const initialForm: EntryForm = {
  type: "expense",
  description: "",
  amount: "",
  category: "Casa",
  date: today(),
};

function moneyInputToCents(value: string) {
  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace(/^R\$/i, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

export function FinanceDashboardApp() {
  const [data, setData] = useFinance();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<EntryForm>(initialForm);
  const [period, setPeriod] = useState("Este mês");

  const navigateInsideApp = (event: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    event.preventDefault();
    if (window.location.pathname === url) return;
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const summary = useMemo(() => totals(data.transactions), [data.transactions]);
  const subscriptions = useMemo(
    () => activeMonthly(data.subscriptions),
    [data.subscriptions],
  );

  const chartData = useMemo(
    () => [
      { name: "Receitas", value: summary.income, color: "#52c7b0" },
      { name: "Despesas", value: summary.expenses, color: "#f17655" },
      { name: "Assinaturas", value: subscriptions, color: "#8b7cf6" },
      {
        name: "Saldo disponível",
        value: Math.max(summary.balance, 0),
        color: "#1f8a70",
      },
    ],
    [summary, subscriptions],
  );

  const recent = [...data.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const openForm = (type: TransactionType) => {
    setForm({
      ...initialForm,
      type,
      category: type === "income" ? "Salário" : "Casa",
      date: today(),
    });
    setFormOpen(true);
  };

  const saveEntry = (event: React.FormEvent) => {
    event.preventDefault();
    const amount = moneyInputToCents(form.amount);
    if (!form.description.trim() || amount <= 0) return;

    const now = new Date().toISOString();
    setData({
      ...data,
      transactions: [
        ...data.transactions,
        {
          id: id(),
          description: form.description.trim(),
          amount,
          type: form.type,
          categoryId: form.category,
          date: form.date,
          status: form.type === "income" ? "received" : "paid",
          createdAt: now,
          updatedAt: now,
        },
      ],
    });
    setFormOpen(false);
  };

  return (
    <div className="finance-dashboard-shell">
      <aside className={menuOpen ? "finance-sidebar is-open" : "finance-sidebar"}>
        <a className="finance-brand" href="/" aria-label="Voltar para Astú">
          <img src="/brand/astu/astu-symbol.png" alt="" />
          <strong>Astú<span>.</span></strong>
        </a>

        <nav aria-label="Navegação financeira">
          {nav.map(([href, label, Icon]) => (
            <a
              key={href}
              className={href === "/app" ? "is-active" : ""}
              href={href}
              onClick={(event) => navigateInsideApp(event, href)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <a className="finance-back" href="/">
          <ArrowLeft size={17} />
          Voltar ao site
        </a>
      </aside>

      {menuOpen && (
        <button
          className="finance-menu-overlay"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="finance-main">
        <header className="finance-header">
          <div className="finance-heading">
            <button
              className="finance-menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={21} />
            </button>
            <div>
              <span>Visão geral</span>
              <h1>Olá{data.name ? `, ${data.name}` : ""}, vamos organizar?</h1>
              <p>Acompanhe o que entra, o que sai e seus próximos passos.</p>
            </div>
          </div>

          <div className="finance-header-actions">
            <select
              aria-label="Selecionar período"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option>Este mês</option>
              <option>Mês anterior</option>
              <option>Últimos 3 meses</option>
              <option>Este ano</option>
            </select>
            <button aria-label="Notificações" className="finance-icon-button">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <section className="finance-summary" aria-label="Resumo financeiro">
          <article className="finance-stat finance-stat-income">
            <div>
              <span>Renda mensal</span>
              <ArrowUpRight size={18} />
            </div>
            <strong>{formatCurrency(summary.income)}</strong>
            <p>{summary.income ? "Receitas registradas no período" : "Adicione sua renda para começar"}</p>
            <button onClick={() => openForm("income")}>Adicionar renda</button>
          </article>

          <article className="finance-stat finance-stat-expense">
            <div>
              <span>Total de despesas</span>
              <ArrowDownRight size={18} />
            </div>
            <strong>{formatCurrency(summary.expenses)}</strong>
            <p>{data.transactions.filter((item) => item.type === "expense").length} registro(s) no período</p>
            <button onClick={() => openForm("expense")}>Nova despesa</button>
          </article>

          <article className="finance-stat finance-stat-balance">
            <div>
              <span>Saldo disponível</span>
              <Wallet size={18} />
            </div>
            <strong>{formatCurrency(summary.balance)}</strong>
            <p>Calculado automaticamente</p>
            <span className="finance-balance-note">
              {summary.balance >= 0 ? "Saldo positivo no período" : "Despesas acima da renda"}
            </span>
          </article>

          <article className="finance-stat finance-stat-subscriptions">
            <div>
              <span>Assinaturas</span>
              <Repeat2 size={18} />
            </div>
            <strong>{formatCurrency(subscriptions)}</strong>
            <p>{data.subscriptions.filter((item) => item.active).length} assinatura(s) ativa(s)</p>
            <a href="/app/assinaturas" onClick={(event) => navigateInsideApp(event, "/app/assinaturas")}>Gerenciar assinaturas</a>
          </article>
        </section>

        <div className="finance-dashboard-grid">
          <section className="finance-panel finance-records">
            <div className="finance-panel-heading">
              <div>
                <span>Movimentações recentes</span>
                <h2>Seus registros</h2>
              </div>
              <button className="finance-primary" onClick={() => openForm("expense")}>
                <Plus size={17} />
                Nova despesa
              </button>
            </div>

            {recent.length ? (
              <div className="finance-record-list">
                {recent.map((entry) => (
                  <article key={entry.id} className="finance-record">
                    <span className={entry.type}>
                      {entry.type === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </span>
                    <div>
                      <strong>{entry.description}</strong>
                      <small>{entry.categoryId} · {new Date(`${entry.date}T12:00:00`).toLocaleDateString("pt-BR")}</small>
                    </div>
                    <b className={entry.type}>
                      {entry.type === "income" ? "+" : "-"} {formatCurrency(entry.amount)}
                    </b>
                  </article>
                ))}
              </div>
            ) : (
              <div className="finance-empty">
                <img src="/brand/astu/astu-symbol.png" alt="" />
                <h3>Seus registros aparecerão aqui.</h3>
                <p>Adicione uma renda ou despesa para a Astú montar seu resumo.</p>
                <div>
                  <button onClick={() => openForm("income")}>Adicionar renda</button>
                  <button onClick={() => openForm("expense")}>Adicionar despesa</button>
                </div>
              </div>
            )}
          </section>

          <section className="finance-panel finance-flow">
            <div className="finance-panel-heading">
              <div>
                <span>Visão do período</span>
                <h2>Fluxo financeiro</h2>
              </div>
              <span className="finance-live">● Atualizado</span>
            </div>

            <div className="finance-chart-layout">
              <div className="finance-donut" role="img" aria-label={`Gráfico do fluxo financeiro: receitas ${formatCurrency(summary.income)}, despesas ${formatCurrency(summary.expenses)}, assinaturas ${formatCurrency(subscriptions)} e saldo ${formatCurrency(summary.balance)}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="67%"
                      outerRadius="90%"
                      paddingAngle={2}
                      stroke="none"
                    >
                      {chartData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div>
                  <span>Saldo</span>
                  <strong>{formatCurrency(summary.balance)}</strong>
                  <small>{period}</small>
                </div>
              </div>

              <div className="finance-chart-legend">
                {chartData.map((item) => {
                  const max = Math.max(...chartData.map((current) => current.value), 1);
                  return (
                    <div key={item.name}>
                      <span style={{ background: item.color }} />
                      <p>
                        <strong>{item.name}</strong>
                        <small>{formatCurrency(item.value)}</small>
                      </p>
                      <i>
                        <b
                          style={{
                            background: item.color,
                            width: `${Math.max((item.value / max) * 100, item.value ? 8 : 0)}%`,
                          }}
                        />
                      </i>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="finance-next-bill">
              <CalendarDays size={17} />
              <div>
                <span>Próxima cobrança</span>
                <strong>
                  {data.subscriptions.find((item) => item.active)?.name ||
                    "Nenhuma assinatura cadastrada"}
                </strong>
              </div>
              <a href="/app/assinaturas" onClick={(event) => navigateInsideApp(event, "/app/assinaturas")}>
                <CreditCard size={16} />
                Ver contas
              </a>
            </div>
          </section>
        </div>
      </main>

      {formOpen && (
        <div className="finance-dialog-backdrop" role="presentation">
          <form className="finance-dialog" onSubmit={saveEntry}>
            <button
              type="button"
              className="finance-dialog-close"
              onClick={() => setFormOpen(false)}
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
            <span>Nova movimentação</span>
            <h2>{form.type === "income" ? "Adicionar renda" : "Registrar despesa"}</h2>

            <div className="finance-type-switch">
              <button
                type="button"
                className={form.type === "income" ? "is-active income" : ""}
                onClick={() => setForm({ ...form, type: "income", category: "Salário" })}
              >
                Receita
              </button>
              <button
                type="button"
                className={form.type === "expense" ? "is-active expense" : ""}
                onClick={() => setForm({ ...form, type: "expense", category: "Casa" })}
              >
                Despesa
              </button>
            </div>

            <label>
              Descrição
              <input
                required
                autoFocus
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder={form.type === "income" ? "Ex.: Salário" : "Ex.: Mercado"}
              />
            </label>
            <label>
              Valor
              <input
                required
                inputMode="decimal"
                value={form.amount}
                onChange={(event) => setForm({ ...form, amount: event.target.value })}
                placeholder="0,00"
              />
            </label>
            <label>
              Categoria
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              Data
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </label>
            <button className="finance-primary finance-save-button">
              {form.type === "income" ? "Salvar renda" : "Salvar despesa"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
