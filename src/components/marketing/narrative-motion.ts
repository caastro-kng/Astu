import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/** Every position is measured from the actual preview, including after a resize. */
export function createNarrative(root: HTMLElement) {
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>("[data-story-copy]"),
  );
  const tokens = Array.from(
    root.querySelectorAll<HTMLElement>("[data-story-token]"),
  );
  const product = root.querySelector<HTMLElement>("[data-story-product]")!;
  const stats = Array.from(
    product.querySelectorAll<HTMLElement>(".mk-stats>div"),
  );
  const goal = product.querySelector<HTMLElement>(".mk-goal")!;
  const movements = product.querySelector<HTMLElement>(".mk-transactions")!;
  const destinations = [stats[1], stats[2], movements, stats[0], goal];
  const color = getComputedStyle(root).getPropertyValue("--foreground").trim();
  const secondary = getComputedStyle(root)
    .getPropertyValue("--muted-foreground")
    .trim();
  const targets = [...stats, goal, movements];
  gsap.set(panels.slice(1), { autoAlpha: 0, y: 18 });
  gsap.set(product, { autoAlpha: 0 });
  gsap.set(targets, { opacity: 0 });
  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      id: "astu-narrative",
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      pin: root.querySelector(".mk-story-pin"),
      pinSpacing: false,
      scrub: 0.4,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
  panels.forEach((panel, i) => {
    if (i)
      tl.to(
        panels[i - 1],
        { autoAlpha: 0, y: -18, duration: 0.15 },
        i - 0.17,
      ).to(panel, { autoAlpha: 1, y: 0, duration: 0.18 }, i);
  });
  tl.to(
    tokens,
    { rotation: 0, x: 0, y: 0, duration: 0.45, stagger: 0.035 },
    0.5,
  )
    .to(
      root.querySelector("[data-story-fox]"),
      {
        scale: 0.72,
        xPercent: -18,
        yPercent: 12,
        opacity: 0.75,
        duration: 0.5,
      },
      0.7,
    )
    .to(product, { autoAlpha: 1, duration: 0.55 }, 1.2);
  tokens.forEach((token, i) => {
    const destination = destinations[i];
    const delta = (axis: "x" | "y") => {
      const from = token.getBoundingClientRect(),
        to = destination.getBoundingClientRect();
      return (
        Number(gsap.getProperty(token, axis)) +
        (axis === "x"
          ? to.left + to.width / 2 - from.left - from.width / 2
          : to.top + to.height / 2 - from.top - from.height / 2)
      );
    };
    tl.to(
      token,
      { x: () => delta("x"), y: () => delta("y"), scale: 0.92, duration: 0.6 },
      1.2 + i * 0.035,
    ).to(token, { autoAlpha: 0, duration: 0.16 }, 1.91 + i * 0.025);
  });
  tl.to(targets, { opacity: 1, stagger: 0.035, duration: 0.22 }, 1.96)
    .to(
      root.querySelector("[data-story-fox]"),
      { autoAlpha: 0, scale: 0.65, duration: 0.45 },
      1.65,
    )
    .to(
      root.querySelector(".mk-story-light"),
      { opacity: 1, duration: 0.7 },
      1.7,
    )
    .to(
      root.querySelectorAll(".mk-story-copies h2"),
      { color, duration: 0.55 },
      1.8,
    )
    .to(
      root.querySelectorAll(".mk-story-copies p"),
      { color: secondary, duration: 0.55 },
      1.8,
    )
    .to(
      root.querySelectorAll(".mk-story-heading>.mk-kicker,.mk-step"),
      {
        color: getComputedStyle(root).getPropertyValue("--success").trim(),
        duration: 0.55,
      },
      1.8,
    )
    .fromTo(
      goal.querySelector("progress"),
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: "left center", duration: 0.65 },
      2.8,
    )
    .to(goal, { y: -7, duration: 0.25 }, 3)
    .to(goal, { y: 0, duration: 0.25 }, 3.65)
    .to(product, { scale: 1.025, duration: 0.45 }, 3.8);
  root
    .querySelectorAll(".mk-story-track i")
    .forEach((segment, i) =>
      tl.fromTo(
        segment,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", duration: 1 },
        i * 0.86,
      ),
    );
  tl.to({}, { duration: 0.25 });
  return tl;
}
