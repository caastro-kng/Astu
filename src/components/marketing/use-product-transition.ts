import { useEffect, useRef, type MouseEvent, type RefObject } from "react";
import { gsap } from "gsap";

export function useProductTransition(
  root: RefObject<HTMLDivElement | null>,
  navigate: (url: string) => void,
) {
  const tween = useRef<gsap.core.Timeline | null>(null);
  const active = useRef(false);
  useEffect(
    () => () => {
      tween.current?.kill();
    },
    [],
  );
  const preload = () => {
    void import("../app/finance-app").catch(() => {
      /* Normal link remains available on failure. */
    });
  };
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = (event.target as Element).closest<HTMLAnchorElement>(
      "a[href]",
    );
    if (!link || link.target || link.hasAttribute("download")) return;
    const url = new URL(link.href, window.location.href);
    if (
      url.origin !== window.location.origin ||
      !/^\/app(?:\/|$)/.test(url.pathname)
    )
      return;
    event.preventDefault();
    if (active.current) return;
    active.current = true;
    const go = () => navigate(url.pathname + url.search + url.hash);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      go();
      return;
    }
    preload();
    const visual = link
      .closest("section")
      ?.querySelector<HTMLElement>(
        "[data-story-product],.mk-product,.mk-fox-visual",
      );
    tween.current = gsap.timeline({
      onComplete: go,
      defaults: { duration: 0.18, ease: "power2.inOut" },
    });
    if (visual) tween.current.to(visual, { scale: 1.025 }, 0);
    tween.current.to(
      root.current?.querySelector(".mk-route-curtain") ?? [],
      { opacity: 1 },
      0,
    );
  };
  return { onClick, onPointerOver: preload, onFocus: preload };
}
