import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatCurrency } from "../../features/finance/utils";
gsap.registerPlugin(ScrollTrigger);

/** The final value reserves its space and is the only value read by assistive technology. */
export function AnimatedCurrency({ value }: { value: number }) {
  const element = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const node = element.current;
    if (!node || node.closest(".mk-story")) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const amount = { value: 0 };
        gsap.to(amount, {
          value,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
          onUpdate: () => {
            node.textContent = formatCurrency(Math.round(amount.value));
          },
          onComplete: () => {
            node.textContent = formatCurrency(value);
          },
        });
      }, node);
      return () => {
        ctx.revert();
        node.textContent = formatCurrency(value);
      };
    });
    return () => mm.revert();
  }, [value]);
  return (
    <span className="mk-currency" aria-label={formatCurrency(value)}>
      <span className="mk-currency-space" aria-hidden="true">
        {formatCurrency(value)}
      </span>
      <span className="mk-currency-number" ref={element} aria-hidden="true">
        {formatCurrency(value)}
      </span>
    </span>
  );
}
