import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhoneFrame, StaticPhoneScene, type PhoneDemoRefs } from "./phone-demo";

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  { number: "01", label: "COMEÇAR", title: "Tudo começa com uma visão mais clara.", description: "Abra a Astú e encontre suas principais informações financeiras em poucos segundos." },
  { number: "02", label: "ENTENDER", title: "Seu mês inteiro em uma única visão.", description: "Veja saldo, receitas, despesas e próximos vencimentos sem precisar procurar em várias telas." },
  { number: "03", label: "ORGANIZAR", title: "Registre uma movimentação em poucos passos.", description: "Adicione uma receita ou despesa e veja seu planejamento ser atualizado." },
  { number: "04", label: "PLANEJAR", title: "Acompanhe o caminho até seus objetivos.", description: "Defina uma meta, acompanhe o progresso e saiba quanto falta para chegar lá." },
  { number: "05", label: "DECIDIR", title: "Organize hoje. Decida melhor amanhã.", description: "A Astú transforma registros simples em uma visão financeira mais clara." },
] as const;

const timelinePoints = { overview: 1.35, transaction: 2.35, goal: 4.1, final: 5.15 } as const;

type Point = { x: number; y: number };

function getTargetCenter(target: HTMLElement, container: HTMLElement): Point {
  let x = target.offsetWidth / 2;
  let y = target.offsetHeight / 2;
  let node: HTMLElement | null = target;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const phoneRefs: PhoneDemoRefs = {
    viewport: useRef<HTMLDivElement>(null),
    icon: useRef<HTMLButtonElement>(null),
    add: useRef<HTMLButtonElement>(null),
    description: useRef<HTMLLabelElement>(null),
    category: useRef<HTMLLabelElement>(null),
    value: useRef<HTMLLabelElement>(null),
    save: useRef<HTMLButtonElement>(null),
    goals: useRef<HTMLSpanElement>(null),
  };

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      let measureTargets = () => {};
      const context = gsap.context(() => {
        const stage = stageRef.current!;
        const all = <T extends Element>(selector: string) => Array.from(stage.querySelectorAll<T>(selector));
        const one = <T extends Element>(selector: string) => stage.querySelector<T>(selector)!;
        const copy = all<HTMLElement>("[data-story-copy]");
        const steps = all<HTMLElement>("[data-story-step]");
        const frame = one<HTMLElement>("[data-phone-frame]");
        const home = one<HTMLElement>("[data-phone-home]");
        const icon = one<HTMLElement>("[data-phone-icon]");
        const splash = one<HTMLElement>("[data-phone-splash]");
        const overview = one<HTMLElement>("[data-phone-overview]");
        const overviewCards = all<HTMLElement>("[data-phone-card]");
        const sheet = one<HTMLElement>("[data-phone-sheet]");
        const fields = all<HTMLElement>("[data-phone-field]");
        const goal = one<HTMLElement>("[data-phone-goal]");
        const tap = one<HTMLElement>("[data-phone-tap]");
        const toast = one<HTMLElement>("[data-phone-toast]");
        const glow = one<HTMLElement>("[data-phone-glow]");
        const progress = one<HTMLElement>("[data-story-progress]");
        const targets: Record<string, Point> = {};
        measureTargets = () => {
          const viewport = phoneRefs.viewport.current!;
          Object.entries(phoneRefs).forEach(([name, ref]) => {
            if (name !== "viewport" && ref.current)
              targets[name] = getTargetCenter(ref.current, viewport);
          });
        };
        const tapX = (name: string) => targets[name].x - tap.offsetWidth / 2;
        const tapY = (name: string) => targets[name].y - tap.offsetHeight / 2;

        measureTargets();
        ScrollTrigger.addEventListener("refreshInit", measureTargets);

        gsap.set(copy.slice(1), { autoAlpha: 0, y: 18, filter: "blur(2px)" });
        gsap.set(steps.slice(1), { color: "#66859c" });
        gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(frame, { autoAlpha: 0, y: 32, scale: 0.94 });
        gsap.set([splash, overview, goal, toast], { autoAlpha: 0 });
        gsap.set(splash, { clipPath: "circle(8% at 50% 58%)" });
        gsap.set(overviewCards, { opacity: 0, y: 12 });
        gsap.set(sheet, { yPercent: 110 });
        gsap.set(fields, { opacity: 0, y: 8 });
        gsap.set(goal, { xPercent: 100 });
        gsap.set(tap, { opacity: 0 });
        gsap.set(glow, { opacity: 0, scale: 0.86 });
        gsap.set("[data-value-updated], [data-phone-new-row]", { autoAlpha: 0, y: 5 });

        const swapCopy = (tl: gsap.core.Timeline, from: number, to: number, at: number) => {
          tl.to(copy[from], { autoAlpha: 0, y: -18, filter: "blur(2px)", duration: 0.18 }, at)
            .to(copy[to], { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.26 }, at + 0.18)
            .to(steps[from], { color: "#66859c", duration: 0.15 }, at)
            .to(steps[to], { color: "#52c7b0", duration: 0.15 }, at + 0.15);
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            id: "astu-phone-story",
            start: "top top+=80",
            end: () => `+=${Math.round(window.innerHeight * (window.innerHeight < 700 ? 2.7 : 3.5))}`,
            pin: stageRef.current,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.addLabel("home", 0)
          .to(frame, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: "power3.out" }, 0)
          .set(tap, { x: () => tapX("icon") + 48, y: () => tapY("icon") + 38 }, 0.24)
          .to(tap, { opacity: 1, x: () => tapX("icon"), y: () => tapY("icon"), duration: 0.32, ease: "power2.out" }, 0.3)
          .to(icon, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, 0.68)
          .to("[data-phone-tap] i", { scale: 1.8, opacity: 0, duration: 0.22 }, 0.68)
          .to(icon, { scale: 4.8, opacity: 0, duration: 0.45, ease: "power2.in" }, 0.9)
          .to(home, { autoAlpha: 0, duration: 0.2 }, 1)
          .to(splash, { autoAlpha: 1, clipPath: "circle(75% at 50% 50%)", duration: 0.52 }, 0.9)
          .to(tap, { opacity: 0, duration: 0.12 }, 0.84)
          .addLabel("overview", timelinePoints.overview);
        swapCopy(tl, 0, 1, timelinePoints.overview);
        tl.to(splash, { autoAlpha: 0, scale: 1.06, duration: 0.34 }, 1.34)
          .to(overview, { autoAlpha: 1, duration: 0.32 }, 1.4)
          .to(overviewCards, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 }, 1.48)
          .fromTo("[data-phone-chart] i", { scaleY: 0 }, { scaleY: 1, duration: 0.38, stagger: 0.035, transformOrigin: "bottom" }, 1.58)
          .to(tap, { opacity: 1, x: () => tapX("add"), y: () => tapY("add"), duration: 0.38, ease: "power2.inOut" }, 2.02)
          .addLabel("transaction", timelinePoints.transaction);
        swapCopy(tl, 1, 2, timelinePoints.transaction);
        tl.set("[data-phone-tap] i", { opacity: 1, scale: 1 }, 2.34)
          .to("[data-phone-add]", { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, 2.4)
          .to("[data-phone-tap] i", { scale: 1.65, opacity: 0, duration: 0.18 }, 2.4)
          .to(sheet, { yPercent: 0, duration: 0.44, ease: "power3.out" }, 2.6)
          .to(tap, { x: () => tapX("description"), y: () => tapY("description"), duration: 0.28 }, 2.84)
          .to(fields[0], { opacity: 1, y: 0, duration: 0.2 }, 3.02)
          .to(tap, { x: () => tapX("category"), y: () => tapY("category"), duration: 0.26 }, 3.12)
          .to(fields[1], { opacity: 1, y: 0, duration: 0.2 }, 3.28)
          .to(tap, { x: () => tapX("value"), y: () => tapY("value"), duration: 0.26 }, 3.38)
          .to(fields[2], { opacity: 1, y: 0, duration: 0.2 }, 3.54)
          .to(tap, { x: () => tapX("save"), y: () => tapY("save"), duration: 0.3 }, 3.64)
          .set("[data-phone-tap] i", { opacity: 1, scale: 1 }, 3.88)
          .to("[data-phone-save]", { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1 }, 3.92)
          .to("[data-phone-tap] i", { scale: 1.65, opacity: 0, duration: 0.18 }, 3.92)
          .to(sheet, { yPercent: 110, duration: 0.36, ease: "power2.in" }, 4.06)
          .to(toast, { autoAlpha: 1, y: -8, duration: 0.22 }, 4.12)
          .to("[data-value-initial]", { autoAlpha: 0, y: -5, duration: 0.16 }, 4.12)
          .to("[data-value-updated]", { autoAlpha: 1, y: 0, duration: 0.2 }, 4.18)
          .to("[data-phone-new-row]", { autoAlpha: 1, y: 0, duration: 0.22 }, 4.18)
          .to("[data-phone-chart-bar=last]", { scaleY: 1.2, backgroundColor: "#c9430a", duration: 0.28 }, 4.16)
          .to(tap, { opacity: 0, duration: 0.12 }, 3.42)
          .addLabel("goal", timelinePoints.goal);
        swapCopy(tl, 2, 3, timelinePoints.goal);
        tl.to(tap, { opacity: 1, x: () => tapX("goals"), y: () => tapY("goals"), duration: 0.34 }, 4.3)
          .set("[data-phone-tap] i", { opacity: 1, scale: 1 }, 4.58)
          .to("[data-phone-goals]", { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }, 4.62)
          .to("[data-phone-tap] i", { scale: 1.65, opacity: 0, duration: 0.18 }, 4.62)
          .to([tap, toast], { autoAlpha: 0, duration: 0.16 }, 4.76)
          .to(overview, { xPercent: -100, autoAlpha: 0, duration: 0.42 }, 4.86)
          .to(goal, { xPercent: 0, autoAlpha: 1, duration: 0.42 }, 4.86)
          .fromTo("[data-phone-goal-progress]", { "--phone-goal": 0.15 }, { "--phone-goal": 1, duration: 0.46 }, 5.02)
          .addLabel("final", timelinePoints.final);
        swapCopy(tl, 3, 4, timelinePoints.final);
        tl.to(goal, { xPercent: 100, autoAlpha: 0, duration: 0.4 }, 5.34)
          .to(overview, { xPercent: 0, autoAlpha: 1, duration: 0.4 }, 5.34)
          .to(glow, { opacity: 1, scale: 1, duration: 0.4 }, 5.48)
          .to(progress, { scaleY: 1, duration: 5.8 }, 0)
          .to({}, { duration: 0.55 });

      }, sectionRef);
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", measureTargets);
        context.revert();
      };
    });

    let cancelled = false;
    const refresh = () => requestAnimationFrame(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      if (window.location.hash !== "#como-funciona") return;
      const trigger = ScrollTrigger.getById("astu-phone-story");
      window.scrollTo({ top: trigger ? trigger.start : Math.max(0, sectionRef.current!.offsetTop - 80) });
    });
    if (document.fonts.status === "loaded") refresh();
    else void document.fonts.ready.then(refresh);
    return () => { cancelled = true; mm.revert(); };
  }, []);

  return (
    <section className="mk-phone-story" id="como-funciona" ref={sectionRef} aria-label="Como funciona a Astú">
      <div className="mk-phone-story-desktop" ref={stageRef}>
        <div className="mk-story-copy-stack">
          {scenes.map((scene, index) => <div data-story-copy key={scene.number}><p className="mk-kicker">{scene.number} / {scene.label}</p><h2>{scene.title}</h2><p>{scene.description}</p>{index === 4 ? <a href="/app" className="mk-button">Experimentar a Astú <ArrowUpRight size={17} /></a> : null}</div>)}
          <div className="mk-story-indicator"><span className="mk-story-track"><i data-story-progress /></span>{scenes.map((scene) => <b data-story-step key={scene.number}>{scene.number}</b>)}</div>
        </div>
        <PhoneFrame refs={phoneRefs} />
      </div>
      <div className="mk-phone-story-mobile">
        {[{ scene: scenes[1], type: "overview" as const }, { scene: scenes[2], type: "transaction" as const }, { scene: scenes[3], type: "goal" as const }].map(({ scene, type }) => <article key={scene.number}><div><p className="mk-kicker">{scene.number} / {scene.label}</p><h2>{scene.title}</h2><p>{scene.description}</p></div><StaticPhoneScene type={type} /></article>)}
        <a href="/app" className="mk-button">Experimentar a Astú <ArrowUpRight size={17} /></a>
      </div>
    </section>
  );
}
