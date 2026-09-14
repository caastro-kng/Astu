import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrganizationPreview } from "./organization-preview";
gsap.registerPlugin(ScrollTrigger);

export function ScrollStory() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const desktop = window.matchMedia("(min-width: 901px)").matches;
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            once: true,
          },
        });
        tl.from("[data-organizer-copy]", {
          opacity: 0,
          x: desktop ? -28 : 0,
          y: desktop ? 0 : 18,
          duration: 0.7,
          clearProps: "all",
        })
          .from(
            "[data-organizer-window]",
            {
              opacity: 0,
              scale: 0.965,
              y: 20,
              duration: 0.8,
              clearProps: "all",
            },
            0.08,
          )
          .from(
            "[data-organizer-sidebar]",
            { opacity: 0, x: -16, duration: 0.55, clearProps: "all" },
            0.22,
          )
          .from(
            "[data-organizer-fox]",
            {
              opacity: 0,
              scale: 0.94,
              y: 16,
              duration: 0.7,
              clearProps: "all",
            },
            0.3,
          )
          .from(
            "[data-organizer-card]",
            {
              opacity: 0,
              y: 16,
              scale: 0.98,
              duration: 0.55,
              stagger: 0.075,
              clearProps: "all",
            },
            0.42,
          );
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="mk-organize-section" id="como-funciona" ref={root}>
      <div className="mk-organize-copy" data-organizer-copy>
        <p className="mk-kicker">02 / ORGANIZAR</p>
        <h2>Reúna tudo em um só lugar.</h2>
        <p>
          Dê um lugar para cada receita, despesa, assinatura e objetivo. Aos
          poucos, os números deixam de competir pela sua atenção e formam uma
          visão clara.
        </p>
      </div>
      <OrganizationPreview />
    </section>
  );
}
