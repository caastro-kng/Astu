import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createNarrative } from "./narrative-motion";
import { demo, demoBalance } from "../../data/mock-finance";
import { formatCurrency } from "../../features/finance/utils";
import { ProductPreview } from "./product-preview";
gsap.registerPlugin(ScrollTrigger);
const scenes = [
  [
    "Observar",
    "Suas finanças estão espalhadas demais?",
    "Contas em um lugar. Metas em outro. Comece reconhecendo o que precisa da sua atenção.",
  ],
  [
    "Organizar",
    "Reúna tudo em um só lugar.",
    "Dê um lugar para cada receita, despesa, assinatura e objetivo.",
  ],
  [
    "Entender",
    "Enxergue o que os números estão dizendo.",
    "Uma visão do mês conecta o dinheiro que entra às escolhas que você faz.",
  ],
  [
    "Planejar",
    "Transforme planos em metas possíveis.",
    "Valor, prazo e aporte: uma intenção se transforma em um próximo passo.",
  ],
  [
    "Decidir",
    "Mais clareza para decidir o próximo passo.",
    "Sua organização financeira começa com um registro. A Astú acompanha o resto.",
  ],
];
export function ScrollStory() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      () => {
        root.current?.classList.add("mk-motion-enabled");
        const ctx = gsap.context(() => {
          if (root.current) createNarrative(root.current);
        }, root);
        return () => {
          ctx.revert();
          root.current?.classList.remove("mk-motion-enabled");
        };
      },
    );
    return () => mm.revert();
  }, []);
  return (
    <section className="mk-story" id="como-funciona" ref={root}>
      <div className="mk-story-pin">
        <div className="mk-story-light" aria-hidden="true" />
        <div className="mk-story-track" aria-hidden="true">
          {scenes.map(([name]) => (
            <span key={name}>
              <i />
            </span>
          ))}
        </div>
        <div className="mk-story-heading">
          <span className="mk-kicker">DO PRIMEIRO OLHAR AO PRÓXIMO PASSO</span>
          <div className="mk-story-copies">
            {scenes.map(([label, title, body], i) => (
              <article data-story-copy key={label}>
                <span className="mk-step">
                  0{i + 1} / {label}
                </span>
                <h2>{title}</h2>
                <p>{body}</p>
                {i === 4 && (
                  <a href="/app" className="mk-button">
                    Acessar minha organização financeira ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
        <div className="mk-story-visual">
          <img
            data-story-fox
            src="/brand/astu/astu-mascot.png"
            width="1254"
            height="1254"
            alt="Raposa Astú observando e organizando as finanças"
            loading="lazy"
          />
          <div className="mk-story-tokens">
            {["Receitas", "Despesas", "Assinaturas", "Contas", "Metas"].map(
              (label, i) => (
                <div
                  data-story-token
                  style={{
                    transform: `translate(${(i % 2 ? 1 : -1) * 45}px, ${i * 9}px) rotate(${i % 2 ? 7 : -7}deg)`,
                  }}
                  key={label}
                >
                  {label}
                  <strong>
                    {
                      [
                        formatCurrency(demo.income),
                        formatCurrency(demo.expenses),
                        formatCurrency(demo.subscriptions[0].amount),
                        formatCurrency(demoBalance),
                        formatCurrency(demo.goal.current),
                      ][i]
                    }
                  </strong>
                </div>
              ),
            )}
          </div>
          <div data-story-product>
            <ProductPreview compact />
          </div>
        </div>
      </div>
    </section>
  );
}
