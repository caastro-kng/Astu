import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const motionQuery = "(prefers-reduced-motion: no-preference)";

export function useMarketingMotion(root: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      const ctx = gsap.context(() => {
        const desktop = window.matchMedia("(min-width: 901px)").matches;
        const duration = desktop ? 0.65 : 0.4;
        if (window.scrollY < 80) {
          const entrance = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
            onComplete: () =>
              root.current?.classList.add("mk-entrance-complete"),
          });
          entrance
            .from(
              ".mk-header .mk-brand",
              { opacity: 0, y: -12, duration: 0.6 },
              0.1,
            )
            .from(
              ".mk-header nav a",
              { opacity: 0, y: -12, duration: 0.55, stagger: 0.055 },
              0.2,
            )
            .from(
              ".mk-header > .mk-button, .mk-menu",
              { opacity: 0, y: -12, duration: 0.55 },
              0.36,
            )
            .fromTo(
              ".mk-header",
              { "--header-line": 0 },
              { "--header-line": 1, duration: 0.75 },
              0.18,
            )
            .from(
              ".mk-hero .mk-kicker",
              { opacity: 0, y: 14, duration: 0.55 },
              0.3,
            )
            .from(
              ".mk-hero .mk-kicker > span",
              { scale: 0, duration: 0.38 },
              0.38,
            )
            .from(
              "[data-title-block]",
              {
                yPercent: 110,
                opacity: 0,
                filter: "blur(6px)",
                duration: 0.84,
                stagger: 0.12,
              },
              0.38,
            )
            .from(
              ".mk-orbit",
              { opacity: 0, scale: 0.88, duration: 0.82 },
              0.62,
            )
            .from(
              ".mk-visual-caption",
              { opacity: 0, y: 10, duration: 0.55 },
              0.64,
            )
            .from(
              ".mk-hero .mk-lead",
              { opacity: 0, y: 18, duration: 0.62 },
              0.72,
            )
            .from(
              ".mk-fox",
              { opacity: 0, scale: 0.9, y: 28, duration: 0.92 },
              0.76,
            )
            .from(
              ".mk-actions > *",
              { opacity: 0, y: 18, duration: 0.62, stagger: 0.08 },
              0.9,
            )
            .from(
              ".mk-float-income",
              { opacity: 0, x: 28, y: -10, scale: 0.96, duration: 0.72 },
              1,
            )
            .from(
              ".mk-float-balance",
              { opacity: 0, x: -28, y: 8, scale: 0.96, duration: 0.72 },
              1.1,
            )
            .from(
              ".mk-float-goal",
              { opacity: 0, x: 24, y: 24, scale: 0.96, duration: 0.72 },
              1.2,
            )
            .from(
              ".mk-note, .mk-demo-label",
              { opacity: 0, y: 12, duration: 0.55, stagger: 0.08 },
              1.3,
            )
            .from(
              ".mk-continue",
              { opacity: 0, clipPath: "inset(0 50% 0 50%)", duration: 0.65 },
              1.45,
            )
            .from(
              ".mk-continue svg",
              { y: -4, duration: 0.32, yoyo: true, repeat: 1 },
              1.68,
            )
            .set("[data-title-block]", { clearProps: "filter" }, 2.04);

          // Waiting one task prevents React Strict Mode's development probe from
          // briefly playing the discarded timeline before its cleanup runs.
          gsap.delayedCall(0, () => entrance.play());
        }

        const reveal = (
          trigger: Element,
          build: (tl: gsap.core.Timeline) => void,
        ) => {
          if (trigger.getBoundingClientRect().bottom < 0) return;
          const tl = gsap.timeline({
            defaults: { duration, ease: "power2.out" },
            scrollTrigger: { trigger, start: "top 87%", once: true },
          });
          build(tl);
        };
        const overview = root.current?.querySelector(".mk-overview");
        if (overview)
          reveal(overview, (tl) => {
            tl.from(".mk-overview>.mk-product", {
              clipPath: "inset(12% 3% 0% round 15px)",
              opacity: 0.2,
              scale: 0.97,
              clearProps: "all",
            });
          });
        gsap.utils
          .toArray<HTMLElement>(".mk-feature-section")
          .forEach((section) => {
            reveal(section, (tl) => {
              tl.from(
                section.firstElementChild,
                { opacity: 0, y: 16, clearProps: "all" },
                0,
              );
              if (section.id === "movimentos")
                tl.from(
                  section.querySelectorAll(".mk-list-preview>div"),
                  {
                    x: desktop ? 28 : 12,
                    opacity: 0,
                    stagger: 0.09,
                    clearProps: "all",
                  },
                  0.1,
                );
              if (section.id === "assinaturas")
                tl.from(
                  section.querySelector(".mk-bills"),
                  {
                    clipPath: "inset(0 12% 0 0 round 15px)",
                    opacity: 0.3,
                    clearProps: "all",
                  },
                  0.1,
                ).from(
                  section.querySelectorAll(".mk-bills>div"),
                  { x: -16, opacity: 0, stagger: 0.12, clearProps: "all" },
                  0.2,
                );
              if (section.id === "planejamento")
                tl.from(
                  section.querySelector(".mk-goal"),
                  { scale: 0.96, opacity: 0, clearProps: "all" },
                  0.1,
                )
                  .from(
                    section.querySelector(".mk-goal progress"),
                    {
                      scaleX: 0,
                      transformOrigin: "left center",
                      clearProps: "transform,transform-origin",
                    },
                    0.2,
                  )
                  .from(
                    section.querySelectorAll(".mk-goal .mk-split,.mk-goal p"),
                    { opacity: 0, y: 12, stagger: 0.1, clearProps: "all" },
                    0.3,
                  );
              if (section.id === "relatorios")
                tl.from(
                  section.querySelector(".mk-report"),
                  {
                    clipPath: "inset(0 0 15% 0 round 15px)",
                    opacity: 0.3,
                    clearProps: "all",
                  },
                  0.1,
                ).from(
                  section.querySelectorAll(".mk-bars i"),
                  {
                    scaleY: 0,
                    transformOrigin: "center bottom",
                    stagger: 0.08,
                    clearProps: "transform,transform-origin",
                  },
                  0.2,
                );
            });
          });
        const final = root.current?.querySelector(".mk-final");
        if (final)
          reveal(final, (tl) => {
            tl.from(final.querySelectorAll("h2,p,.mk-button,small"), {
              opacity: 0,
              y: 16,
              stagger: 0.07,
              clearProps: "all",
            });
          });
      }, root);
      return () => ctx.revert();
    });
    mm.add(
      "(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const visual =
          root.current?.querySelector<HTMLElement>(".mk-fox-visual");
        const hero = root.current?.querySelector<HTMLElement>(".mk-hero");
        if (!visual || !hero) return;
        const moveX = gsap.quickTo(visual, "x", {
          duration: 0.55,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(visual, "y", {
          duration: 0.55,
          ease: "power3.out",
        });
        const onMove = (event: PointerEvent) => {
          if (!root.current?.classList.contains("mk-entrance-complete")) return;
          const box = hero.getBoundingClientRect();
          moveX(((event.clientX - box.left) / box.width - 0.5) * 16);
          moveY(((event.clientY - box.top) / box.height - 0.5) * 12);
        };
        const reset = () => {
          moveX(0);
          moveY(0);
        };
        hero.addEventListener("pointermove", onMove, { passive: true });
        hero.addEventListener("pointerleave", reset);
        return () => {
          hero.removeEventListener("pointermove", onMove);
          hero.removeEventListener("pointerleave", reset);
          gsap.set(visual, { clearProps: "transform" });
        };
      },
    );
    return () => {
      root.current?.classList.remove("mk-entrance-complete");
      mm.revert();
    };
  }, [root]);
}
