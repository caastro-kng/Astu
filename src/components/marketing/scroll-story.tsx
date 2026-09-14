import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrganizationPreview } from "./organization-preview";

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  { number: "01", label: "OBSERVAR", title: "Veja tudo com mais clareza.", description: "Receitas, contas e objetivos deixam de disputar sua atenção quando você consegue observar o cenário inteiro." },
  { number: "02", label: "ORGANIZAR", title: "Reúna tudo em um só lugar.", description: "Dê um lugar para cada receita, despesa, assinatura e objetivo. Aos poucos, os números formam uma visão clara." },
  { number: "03", label: "PLANEJAR", title: "Planeje o próximo passo.", description: "Com o dashboard organizado, sua meta ganha direção e cada decisão passa a fazer parte de um plano possível." },
] as const;

const sceneStates = {
  observe: {
    income: { x: -42, y: 24, scale: 0.94, opacity: 0.78 },
    expense: { x: 48, y: -16, scale: 0.94, opacity: 0.72 },
    bill: { x: 36, y: 22, scale: 0.95, opacity: 0.62 },
    balance: { x: 52, y: 38, scale: 0.94, opacity: 0.48 },
    goal: { x: 18, y: 34, scale: 0.95, opacity: 0.38 },
  },
  organize: { duration: 0.72, ease: "power2.inOut" },
  plan: { duration: 0.72, ease: "power2.inOut" },
} as const;

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const text = gsap.utils.toArray<HTMLElement>("[data-story-copy]");
        const dots = gsap.utils.toArray<HTMLElement>("[data-story-step]");
        const query = (selector: string) =>
          sectionRef.current!.querySelector<HTMLElement>(selector)!;
        const card = (name: string) => query(`[data-scene-card="${name}"]`);
        const fox = query("[data-organizer-fox]");
        const sidebar = query("[data-organizer-sidebar]");
        const dashboard = query("[data-organizer-window]");
        const progress = query("[data-story-progress]");
        const goalProgress = query("[data-goal-progress]");

        gsap.set(text.slice(1), { autoAlpha: 0, y: 24, filter: "blur(5px)" });
        gsap.set(dots.slice(1), { color: "#66859c" });
        gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(dashboard, { scale: 0.97 });
        gsap.set(sidebar, { opacity: 0.46 });
        gsap.set(fox, { x: 0, y: 8, scale: 1.04 });
        Object.entries(sceneStates.observe).forEach(([name, state]) => gsap.set(card(name), state));
        gsap.set(goalProgress, { "--goal-fill": 0.3 });

        const swapCopy = (timeline: gsap.core.Timeline, outgoing: HTMLElement, incoming: HTMLElement, at: number) => {
          timeline
            .to(outgoing, { autoAlpha: 0, y: -24, filter: "blur(5px)", duration: 0.28, ease: "power2.in" }, at)
            .to(incoming, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.36, ease: "power3.out" }, at + 0.26);
        };

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            id: "astu-how-it-works",
            start: "top top+=80",
            end: () => `+=${Math.round(window.innerHeight * (window.innerHeight < 700 ? 1.65 : 2.15))}`,
            pin: stageRef.current,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.addLabel("observe", 0).to(progress, { scaleY: 0.5, duration: 1 }, 0);
        swapCopy(timeline, text[0], text[1], 0.72);
        timeline
          .to([card("income"), card("expense"), card("bill"), card("balance")], { x: 0, y: 0, scale: 1, opacity: 1, ...sceneStates.organize }, 0.72)
          .to(sidebar, { opacity: 1, duration: 0.6 }, 0.78)
          .to(fox, { x: -18, y: 0, scale: 1, duration: 0.7 }, 0.76)
          .to(dots[0], { color: "#66859c", duration: 0.2 }, 0.82)
          .to(dots[1], { color: "#52c7b0", duration: 0.2 }, 0.82)
          .addLabel("organize", 1);
        swapCopy(timeline, text[1], text[2], 1.72);
        timeline
          .to(card("goal"), { x: 0, y: 0, scale: 1.015, opacity: 1, ...sceneStates.plan }, 1.7)
          .to(card("goal"), { scale: 1, duration: 0.3 }, 2.38)
          .to(goalProgress, { "--goal-fill": 1, duration: 0.72 }, 1.76)
          .to(fox, { x: -30, y: 4, scale: 0.96, duration: 0.72 }, 1.72)
          .to(dashboard, { scale: 1, duration: 0.72 }, 1.72)
          .to(dots[1], { color: "#66859c", duration: 0.2 }, 1.82)
          .to(dots[2], { color: "#52c7b0", duration: 0.2 }, 1.82)
          .to(progress, { scaleY: 1, duration: 1 }, 1)
          .addLabel("plan", 2)
          .to({}, { duration: 0.6 });
      }, sectionRef);

      return () => context.revert();
    });

    let cancelled = false;
    const refreshAndAlignAnchor = () => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        ScrollTrigger.refresh();
        if (window.location.hash !== "#como-funciona") return;
        const storyTrigger = ScrollTrigger.getById("astu-how-it-works");
        window.scrollTo({
          top: storyTrigger
            ? storyTrigger.start
            : Math.max(0, sectionRef.current!.offsetTop - 80),
        });
      });
    };
    if (document.fonts.status === "loaded") refreshAndAlignAnchor();
    else void document.fonts.ready.then(refreshAndAlignAnchor);

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, []);

  return (
    <section className="mk-organize-section" id="como-funciona" ref={sectionRef} aria-label="Como a Astú organiza suas finanças">
      <ol className="mk-story-accessible">
        {scenes.map((scene) => <li key={scene.number}><h2>{scene.title}</h2><p>{scene.description}</p></li>)}
      </ol>
      <div className="mk-story-stage" ref={stageRef}>
        <div className="mk-story-copy-stack" aria-hidden="true">
          {scenes.map((scene) => (
            <div data-story-copy key={scene.number}>
              <p className="mk-kicker">{scene.number} / {scene.label}</p>
              <h2>{scene.title}</h2>
              <p>{scene.description}</p>
            </div>
          ))}
          <div className="mk-story-indicator">
            <span className="mk-story-track"><i data-story-progress /></span>
            {scenes.map((scene) => <b data-story-step key={scene.number}>{scene.number}</b>)}
          </div>
        </div>
        <OrganizationPreview />
      </div>
    </section>
  );
}
