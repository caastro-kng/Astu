import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
export function Brand() {
  return (
    <a className="mk-brand" href="/" aria-label="Astú, início">
      <img src="/brand/astu/favicon.png" alt="" width="42" height="42" />
      <span>
        Astú<span className="mk-brand-dot">.</span>
      </span>
    </a>
  );
}
export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="mk-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <Brand />
      <nav
        className={open ? "is-open" : ""}
        id="marketing-navigation"
        aria-label="Navegação principal"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {[
          ["#inicio", "Início"],
          ["#recursos", "Recursos"],
          ["#como-funciona", "Como funciona"],
          ["#planejamento", "Planejamento"],
          ["#relatorios", "Relatórios"],
        ].map(([href, text]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {text}
          </a>
        ))}
        <a href="/app">Entrar</a>
      </nav>
      <a className="mk-button mk-small" href="/app">
        Começar agora <ArrowUpRight size={16} />
      </a>
      <button
        className="mk-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="marketing-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
