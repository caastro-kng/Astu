import { useRef } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ShieldCheck,
  Target,
  Wallet,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
} from "lucide-react";
import { useMarketingMotion } from "./use-marketing-motion";
import { useProductTransition } from "./use-product-transition";
import { MarketingHeader, Brand } from "./marketing-header";
import { ScrollStory } from "./scroll-story";
import { GoalPreview, ProductPreview, ReportsPreview } from "./product-preview";
import { demo, demoBalance } from "../../data/mock-finance";
import { formatCurrency } from "../../features/finance/utils";
import "./marketing.css";
import "./refinements.css";
import "./motion.css";

function FloatingFinanceCard({
  label,
  value,
  className,
  children,
}: {
  label: string;
  value: string;
  className: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`mk-floating ${className}`}>
      <small>{label}</small>
      <strong>{value}</strong>
      {children}
    </div>
  );
}
export function Homepage({
  onNavigate = (url: string) => window.location.assign(url),
}: {
  onNavigate?: (url: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  useMarketingMotion(root);
  const transition = useProductTransition(root, onNavigate);
  return (
    <div className="mk-site" ref={root} {...transition}>
      <div className="mk-route-curtain" aria-hidden="true" />
      <span
        id="mk-scroll-sentinel"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 80,
          width: 1,
          height: 1,
          pointerEvents: "none",
        }}
      />
      <a className="mk-skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <MarketingHeader />
      <main id="conteudo">
        <section className="mk-hero" id="inicio">
          <div className="mk-hero-copy">
            <p className="mk-kicker" data-enter>
              <span /> Estratégia para uma vida financeira mais leve
            </p>
            <h1 data-enter>
              <span className="mk-title-mask">
                <span data-title-block>Entenda seu dinheiro.</span>
              </span>
              <span className="mk-title-mask">
                <em data-title-block>Planeje com astúcia.</em>
              </span>
            </h1>
            <p className="mk-lead" data-enter>
              A Astú reúne receitas, despesas, contas, assinaturas e metas para
              transformar números dispersos em decisões mais claras.
            </p>
            <div className="mk-actions" data-enter>
              <a className="mk-button" href="/app">
                Organizar minhas finanças <ArrowUpRight size={18} />
              </a>
              <a className="mk-text-link" href="#como-funciona">
                Conhecer a Astú <ArrowDown size={16} />
              </a>
            </div>
            <p className="mk-note" data-enter>
              <ShieldCheck size={15} /> Sua organização. No seu ritmo. Sob seu
              controle.
            </p>
          </div>
          <div className="mk-fox-visual">
            <div className="mk-orbit" />
            <span className="mk-visual-caption">
              UM OLHAR ESTRATÉGICO PARA O SEU DINHEIRO
            </span>
            <img
              className="mk-fox"
              src="/brand/astu/astu-mascot.png"
              width="1254"
              height="1254"
              fetchPriority="high"
              alt="Raposa Astú, atenta e confiante, com detalhe verde-menta no peito"
            />
            <FloatingFinanceCard
              label="Saldo disponível"
              value={formatCurrency(demoBalance)}
              className="mk-float-balance"
            >
              <span>
                <Check size={13} /> Tudo em perspectiva
              </span>
            </FloatingFinanceCard>
            <FloatingFinanceCard
              label="Receitas do mês"
              value={formatCurrency(demo.income)}
              className="mk-float-income"
            >
              <ArrowUpRight size={19} />
            </FloatingFinanceCard>
            <FloatingFinanceCard
              label={demo.goal.name}
              value={`${Math.round((demo.goal.current / demo.goal.target) * 100)}% do caminho`}
              className="mk-float-goal"
            >
              <progress
                value={demo.goal.current}
                max={demo.goal.target}
                aria-label="Progresso da meta demonstrativa"
              />
            </FloatingFinanceCard>
            <small className="mk-demo-label">
              Valores fictícios para demonstrar o produto
            </small>
          </div>
          <a className="mk-continue" href="#como-funciona">
            <span>Observe. Organize. Vá além.</span>
            <ArrowDown size={17} />
          </a>
        </section>
        <ScrollStory />
        <section className="mk-overview mk-section" id="recursos">
          <div className="mk-section-title">
            <p className="mk-kicker">UMA VISÃO. MUITAS POSSIBILIDADES.</p>
            <h2>
              Seu mês inteiro,
              <br />
              sem perder o fio da meada.
            </h2>
            <p>
              Receitas, despesas, saldo e próximos vencimentos organizados em
              uma visão direta.
            </p>
          </div>
          <ProductPreview />
          <div className="mk-feature-grid">
            {[
              [
                Wallet,
                "Entenda o seu mês",
                "Cada entrada e saída ajuda a construir uma visão que faz sentido para você.",
              ],
              [
                CalendarDays,
                "Não perca os vencimentos",
                "Dê visibilidade às pequenas cobranças que se repetem.",
              ],
              [
                Target,
                "Planeje seus objetivos",
                "Defina o destino e acompanhe a distância até chegar lá.",
              ],
              [
                ChartNoAxesCombined,
                "Veja além dos números",
                "Reconheça categorias, hábitos e mudanças ao longo do tempo.",
              ],
            ].map(([Icon, title, body]) => {
              const I = Icon as typeof Wallet;
              return (
                <article key={String(title)}>
                  <I size={24} />
                  <h3>{String(title)}</h3>
                  <p>{String(body)}</p>
                </article>
              );
            })}
          </div>
          <a className="mk-text-link" href="/app">
            Explorar a visão geral <ArrowUpRight size={18} />
          </a>
        </section>
        <section className="mk-section mk-feature-section" id="movimentos">
          <div>
            <p className="mk-kicker">RECEITAS E DESPESAS</p>
            <h2>Cada movimento tem uma história.</h2>
            <p>
              Registre o que entra e o que sai. Encontre a categoria, a data e o
              valor sem procurar em lugares diferentes.
            </p>
            <a className="mk-text-link" href="/app/movimentos">
              Organizar meus movimentos <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="mk-list-preview">
            {demo.transactions.map((x) => (
              <div key={x.name}>
                <span className="mk-icon">
                  <Wallet size={18} />
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
        </section>
        <section
          className="mk-section mk-feature-section reverse"
          id="assinaturas"
        >
          <div>
            <p className="mk-kicker">ASSINATURAS E CONTAS</p>
            <h2>
              Pequenos pagamentos.
              <br />
              Uma visão completa.
            </h2>
            <p>
              Saiba quanto os serviços recorrentes custam e quando cada cobrança
              chega. Mais previsibilidade para o seu mês.
            </p>
            <a className="mk-text-link" href="/app/assinaturas">
              Acompanhar assinaturas <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="mk-bills">
            <CalendarDays size={28} />
            <h3>O próximo vencimento já está à vista.</h3>
            {demo.subscriptions.map((x) => (
              <div key={x.name}>
                <time>{x.day}</time>
                <b>{x.name}</b>
                <strong>{formatCurrency(x.amount)}</strong>
              </div>
            ))}
            <small>Demonstração · cobranças mensais</small>
          </div>
        </section>
        <section className="mk-section mk-feature-section" id="planejamento">
          <div>
            <p className="mk-kicker">METAS E PLANEJAMENTO</p>
            <h2>O que importa para você merece um plano.</h2>
            <p>
              Defina valores e aportes. Acompanhe cada avanço e transforme “um
              dia” em um próximo passo.
            </p>
            <a className="mk-text-link" href="/app/metas">
              Criar minha primeira meta <ArrowUpRight size={18} />
            </a>
          </div>
          <GoalPreview />
        </section>
        <section
          className="mk-section mk-feature-section reverse"
          id="relatorios"
        >
          <div>
            <p className="mk-kicker">RELATÓRIOS E CLAREZA</p>
            <h2>Descubra os padrões por trás dos seus gastos.</h2>
            <p>
              Olhe para as categorias e para a evolução do seu dinheiro.
              Informação simples para decisões mais conscientes.
            </p>
            <a className="mk-text-link" href="/app/relatorios">
              Conhecer os relatórios <ArrowUpRight size={18} />
            </a>
          </div>
          <ReportsPreview />
        </section>
        <section className="mk-privacy mk-section" id="privacidade">
          <ShieldCheck size={38} />
          <div>
            <p className="mk-kicker">PRIVACIDADE E CONTROLE</p>
            <h2>
              Seu dinheiro é pessoal.
              <br />
              Sua organização também.
            </h2>
            <p>
              Os registros ficam neste navegador. Você pode exportar um backup
              em Configurações. Não há conexão com bancos nem envio automático
              de suas finanças para outros serviços.
            </p>
            <small>
              Ao trocar de dispositivo ou limpar os dados do navegador, seus
              registros não são sincronizados. Mantenha um backup.
            </small>
          </div>
        </section>
        <section className="mk-final mk-section">
          <p className="mk-kicker">
            OBSERVAR → ORGANIZAR → ENTENDER → PLANEJAR → DECIDIR
          </p>
          <h2>
            Mais clareza.
            <br />
            <em>Mais espaço para viver.</em>
          </h2>
          <p>A próxima boa decisão começa com uma visão melhor.</p>
          <a className="mk-button" href="/app">
            Acessar minha organização financeira <ArrowUpRight size={18} />
          </a>
          <small>
            A demonstração é fictícia. Sua área financeira começa vazia.
          </small>
        </section>
      </main>
      <footer className="mk-footer">
        <Brand />
        <p>Escolhas inteligentes começam aqui.</p>
        <a href="#privacidade">Privacidade</a>
        <a href="/app">Entrar na Astú</a>
        <span>© {new Date().getFullYear()} Astú</span>
      </footer>
    </div>
  );
}
