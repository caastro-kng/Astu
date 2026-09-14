import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
          const panels = gsap.utils.toArray<HTMLElement>("[data-story-copy]");
          gsap.set(panels.slice(1), { autoAlpha: 0, y: 24 });
          gsap.set("[data-story-product]", {
            autoAlpha: 0,
            scale: 0.78,
            y: 50,
          });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              pin: root.current?.querySelector(".mk-story-pin"),
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          panels.forEach((panel, i) => {
            if (i) {
              tl.to(
                panels[i - 1],
                { autoAlpha: 0, y: -24, duration: 0.15 },
                i - 0.2,
              ).to(panel, { autoAlpha: 1, y: 0, duration: 0.2 }, i);
            }
          });
          tl.to(
            "[data-story-token]",
            { rotation: 0, x: 0, y: 0, stagger: 0.04, duration: 0.6 },
            0.55,
          )
            .to(
              "[data-story-fox]",
              {
                scale: 0.6,
                xPercent: 45,
                yPercent: 35,
                autoAlpha: 0,
                duration: 0.6,
              },
              1.4,
            )
            .to(
              "[data-story-token]",
              { autoAlpha: 0, scale: 0.9, duration: 0.35 },
              1.65,
            )
            .to(
              "[data-story-product]",
              { autoAlpha: 1, scale: 1, y: 0, duration: 0.65 },
              1.8,
            )
            .to(
              "[data-story-product] .mk-goal",
              { outline: "2px solid #52C7B0", duration: 0.2 },
              3,
            )
            .to("[data-story-product]", { scale: 1.04, duration: 0.5 }, 3.8);
          tl.to({}, { duration: 0.4 });
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
                  <span>✓</span>
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
