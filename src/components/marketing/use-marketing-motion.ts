import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const motionQuery = "(prefers-reduced-motion: no-preference)";

/** Entrance is independent from scroll; resizing never replays completed reveals. */
export function useMarketingMotion(root: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      const ctx = gsap.context(() => {
        const desktop = window.matchMedia("(min-width: 901px)").matches;
        const duration = desktop ? 0.65 : 0.4;
        if (window.scrollY < 80) {
          const entrance = gsap.timeline({
            defaults: {
              ease: "power2.out",
              duration,
              clearProps: "transform,opacity",
            },
          });
          entrance
            .from(".mk-header", { opacity: 0, y: -16 }, 0)
            .from(".mk-hero .mk-kicker", { opacity: 0, y: 16 }, 0.06)
            .from(
              "[data-title-block]",
              { y: 26, opacity: 0, stagger: 0.08 },
              0.1,
            )
            .from(".mk-hero .mk-lead", { opacity: 0, y: 16 }, 0.2)
            .from(
              ".mk-actions, .mk-note",
              { opacity: 0, y: 16, stagger: 0.07 },
              0.27,
            )
            .from(".mk-fox", { opacity: 0, scale: 0.96 }, 0.13)
            .from(".mk-floating", { opacity: 0, y: 20, stagger: 0.08 }, 0.32);
        }
        // Native scroll; only the secondary backdrop moves, not the title.
        if (desktop)
          gsap.to(".mk-orbit", {
            y: 32,
            scale: 1.04,
            ease: "none",
            scrollTrigger: {
              trigger: ".mk-hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.35,
            },
          });

        const reveal = (
          trigger: Element,
          build: (tl: gsap.core.Timeline) => void,
        ) => {
          // A restored scroll position must not hide content above the viewport.
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
              const copy = section.firstElementChild;
              tl.from(copy, { opacity: 0, y: 16, clearProps: "all" }, 0);
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
    return () => mm.revert();
  }, [root]);
}
