"use client";

import React from "react";

declare global {
  interface Window {
    __heroAnimationComplete?: boolean;
    openBookCallModal?: (tab?: "book-call" | "get-quote") => void;
  }
}

import dynamic from "next/dynamic";
import Chat from "@/app/components/icons/Chat";
import Eye from "@/app/components/icons/Eye";
import Logo from "@/app/components/icons/Logo";
import Button from "@/app/components/ui/Button";
import { TickerIcon } from "@/app/components/ui/Ticker";
import content from "@/app/data/content.json";

type GsapCore = typeof import("gsap").gsap;
type GsapTimeline = ReturnType<GsapCore["timeline"]>;

const ShaderFallback = () => (
  <div
    aria-hidden="true"
    className="h-full w-full bg-gradient-to-br from-[#FF4502]/20 via-[#FF6A3D]/10 to-[#FF4502]/20"
  />
);

const Shader = dynamic(() => import("@/app/components/effects/Shader"), {
  ssr: false,
  loading: () => <ShaderFallback />,
});

interface HeroSectionProps {
  setIsWorkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ setIsWorkModalOpen }) => {
  const [eyeOffset, setEyeOffset] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const [shaderInView, setShaderInView] = React.useState(false);
  const [allowAnimations, setAllowAnimations] = React.useState(false);
  const gsapModuleRef = React.useRef<GsapCore | null>(null);
  const scrollPluginLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setAllowAnimations(true);
      return;
    }

    if (typeof window === "undefined") return;

    let cancelled = false;
    let idleHandle: number | null = null;
    let timeoutId: number | null = null;

    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(
        () => {
          if (!cancelled) {
            setAllowAnimations(true);
          }
        },
        { timeout: 600 }
      );
    } else {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          setAllowAnimations(true);
        }
      }, 180);
    }

    return () => {
      cancelled = true;
      if (
        idleHandle !== null &&
        typeof window.cancelIdleCallback === "function"
      ) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    function handleMove(e: MouseEvent) {
      const workBtn = document.getElementById("hero-latest-work-btn");
      if (!workBtn) return;
      const rect = workBtn.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      // Map to SVG coordinates (20x20, center at 10,10)
      const svgX = (mouseX / rect.width) * 20;
      const svgY = (mouseY / rect.height) * 20;
      let dx = svgX - 10;
      let dy = svgY - 10;
      const maxR = 2;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > maxR) {
        dx = (dx / r) * maxR;
        dy = (dy / r) * maxR;
      }
      // If mouse is outside button, center the eye
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        setEyeOffset({ x: 0, y: 0 });
      } else {
        setEyeOffset({ x: dx, y: dy });
      }
    }
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", () => setEyeOffset({ x: 0, y: 0 }));
    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const buttonsRef = React.useRef<HTMLDivElement>(null);
  const statsRef = React.useRef<HTMLDivElement>(null);
  const tickerRef = React.useRef<HTMLDivElement>(null);
  const clientsLabelRef = React.useRef<HTMLSpanElement>(null);
  const svgContainerRef = React.useRef<HTMLDivElement>(null);
  const mobileLogoRef = React.useRef<HTMLDivElement>(null);

  const getGsap = React.useCallback(async (registerScrollTo = false) => {
    if (!gsapModuleRef.current) {
      const mod = await import("gsap");
      const instance =
        (mod as unknown as { gsap?: GsapCore }).gsap ??
        (mod as unknown as { default?: GsapCore }).default ??
        (mod as unknown as GsapCore);
      gsapModuleRef.current = instance;
    }

    const gsapInstance = gsapModuleRef.current!;

    if (registerScrollTo && !scrollPluginLoadedRef.current) {
      const pluginModule = await import("gsap/ScrollToPlugin");
      const plugin =
        (pluginModule as { ScrollToPlugin?: unknown }).ScrollToPlugin ??
        (pluginModule as { default?: unknown }).default;
      if (plugin) {
        gsapInstance.registerPlugin(plugin as unknown as never);
        scrollPluginLoadedRef.current = true;
      }
    }

    return gsapInstance;
  }, []);

  React.useEffect(() => {
    if (!allowAnimations) return;
    if (typeof window === "undefined") return;

    let splitInstance: { revert: () => void } | null = null;
    let timeline: GsapTimeline | null = null;
    let cancelled = false;

    const run = async () => {
      const gsapInstance = await getGsap();
      if (cancelled) return;

      timeline = gsapInstance.timeline({ delay: 0.3 });

      if (mobileLogoRef.current && window.innerWidth < 768) {
        gsapInstance.set(mobileLogoRef.current, {
          opacity: 0,
          y: 24,
          filter: "blur(24px)",
        });
        timeline.to(
          mobileLogoRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power1.out",
          },
          0
        );
      }

      if (titleRef.current) {
        gsapInstance.set(titleRef.current, { opacity: 1 });

        if (prefersReducedMotion) {
          timeline.fromTo(
            titleRef.current,
            { opacity: 0, y: 12, filter: "blur(24px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.78,
              ease: "power1.out",
            },
            0.2
          );
        } else {
          try {
            const splitTextModule = await import("gsap/SplitText");
            if (cancelled || !titleRef.current) return;

            const SplitTextConstructor =
              (splitTextModule as { SplitText?: unknown }).SplitText ??
              (splitTextModule as { default?: unknown }).default;

            if (!SplitTextConstructor) {
              throw new Error("SplitText plugin unavailable");
            }

            const SplitTextCtor = SplitTextConstructor as unknown as {
              new (target: HTMLElement, vars?: { type?: string }): {
                words?: HTMLElement[];
                revert: () => void;
              };
              register?: (core: GsapCore) => void;
            };

            if (SplitTextCtor.register) {
              SplitTextCtor.register(gsapInstance);
            } else {
              gsapInstance.registerPlugin(SplitTextCtor as unknown as never);
            }

            const pluginInstance = new SplitTextCtor(titleRef.current, {
              type: "words",
            });
            splitInstance = pluginInstance;
            const words = pluginInstance.words ?? [];
            gsapInstance.set(words, {
              opacity: 0,
              y: 12,
              filter: "blur(24px)",
            });
            timeline.to(
              words,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.78,
                ease: "power1.out",
                stagger: 0.06,
              },
              0.2
            );
          } catch {
            if (titleRef.current) {
              timeline.fromTo(
                titleRef.current,
                { opacity: 0, y: 12, filter: "blur(24px)" },
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 1.08,
                  ease: "power1.out",
                },
                0.2
              );
            }
          }
        }
      }

      if (subtitleRef.current) {
        timeline.from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 12,
            filter: "blur(24px)",
            duration: 1.08,
            ease: "power1.out",
          },
          0.7
        );
      }

      timeline.call(() => {
        window.__heroAnimationComplete = true;
        window.dispatchEvent(new Event("heroAnimationComplete"));
      });

      if (buttonsRef.current) {
        timeline.from(
          buttonsRef.current,
          {
            opacity: 0,
            y: 12,
            filter: "blur(24px)",
            duration: 1.08,
            ease: "power1.out",
          },
          0.9
        );
      }

      if (statsRef.current) {
        timeline.from(
          statsRef.current,
          {
            opacity: 0,
            y: 12,
            filter: "blur(24px)",
            duration: 1.08,
            ease: "power1.out",
          },
          1.1
        );
      }

      if (clientsLabelRef.current) {
        gsapInstance.set(clientsLabelRef.current, {
          opacity: 0,
          y: 12,
          filter: "blur(24px)",
        });
        timeline.to(
          clientsLabelRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.08,
            ease: "power1.out",
          },
          1.3
        );
      }

      if (tickerRef.current) {
        gsapInstance.set(tickerRef.current, {
          opacity: 0,
          y: 12,
          filter: "blur(24px)",
        });
        timeline.to(
          tickerRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.08,
            ease: "power1.out",
          },
          1.35
        );
      }

      if (svgContainerRef.current) {
        timeline.from(
          svgContainerRef.current,
          {
            opacity: 0,
            y: 12,
            filter: "blur(24px)",
            duration: 1.08,
            ease: "power1.out",
          },
          1.65
        );

        gsapInstance.set(svgContainerRef.current, { opacity: 0, y: 32 });
        timeline.to(
          svgContainerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: "expo.out",
          },
          "-=0.67"
        );
      }

      if (tickerRef.current) {
        gsapInstance.set(tickerRef.current, {
          opacity: 0,
          y: 18,
          filter: "blur(24px)",
        });
        timeline.to(
          tickerRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.08,
            ease: "power1.out",
          },
          "+=0.10"
        );
      }

      timeline.call(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("heroAnimComplete"));
        }
      });

      timeline.eventCallback("onComplete", () => {
        window.__heroAnimationComplete = true;
        window.dispatchEvent(new Event("heroAnimationComplete"));
      });
    };

    run();

    return () => {
      cancelled = true;
      timeline?.kill();
      if (splitInstance && typeof splitInstance.revert === "function") {
        splitInstance.revert();
      }
    };
  }, [prefersReducedMotion, allowAnimations, getGsap]);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setShaderInView(false);
      return;
    }
    if (typeof window === "undefined") return;
    const node = svgContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShaderInView(true);
          } else {
            setShaderInView(false);
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section
      id="hero"
      className="flex h-svh flex-col justify-center p-6 pt-10 pb-26 md:p-10 md:pb-26"
    >
      {/* Mobile logo - above header */}
      <div ref={mobileLogoRef} className="flex w-full justify-center md:hidden">
        <Logo width={69} height={26} />
      </div>

      <div className="flex h-full items-center gap-6 md:flex-row md:items-center md:gap-8">
        <div className="md:text-lef flex h-full flex-col text-center md:w-2xl md:justify-between">
          <div className="flex h-full flex-col items-center justify-center gap-8 md:items-start md:justify-start">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col items-center gap-2 md:items-start md:gap-4">
                <div
                  ref={statsRef}
                  className="flex w-fit items-center gap-2 pl-[3px]"
                >
                  <span className="inline-block h-[6px] w-[6px] rounded-full bg-emerald-500 ring-3 ring-emerald-500/20" />
                  <span className="text-sm font-semibold text-emerald-500">
                    Booking for Q{Math.ceil((new Date().getMonth() + 1) / 3)}{" "}
                    {new Date().getFullYear()}
                  </span>
                </div>
                <h1
                  ref={titleRef}
                  className="heading-1 font-display font-semibold text-gray-800 md:text-left"
                >
                  {content.hero.heading}
                </h1>
              </div>
              <p
                ref={subtitleRef}
                className="whitespace-pre-line text-gray-600 md:text-left"
                dangerouslySetInnerHTML={{ __html: content.hero.subheading }}
              />
            </div>
            <div className="flex w-fit flex-col gap-3">
              <div
                ref={buttonsRef}
                className="flex flex-row justify-center gap-2 md:justify-start"
              >
                {/* Primary CTA mirrors Breather styling */}
                <Button
                  variant="primary"
                  icon={<Chat fill="#fff" size={20} />}
                  label="Book Call"
                  onClick={() => {
                    if (typeof window.openBookCallModal === "function") {
                      window.openBookCallModal("book-call");
                    }
                  }}
                />
                <Button
                  id="hero-latest-work-btn"
                  variant="secondary"
                  icon={
                    <Eye
                      innerEyeOffset={eyeOffset}
                      style={{ pointerEvents: "none" }}
                    />
                  }
                  label="Latest Work"
                  size="md"
                  onClick={() => {
                    setIsWorkModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
          {/* Client logos ticker */}
          <div className="flex flex-col items-center gap-6 md:items-start">
            <span
              ref={clientsLabelRef}
              className="text-sm font-medium text-gray-500"
            >
              {content.hero.clientsLabel}
            </span>
            <div
              ref={tickerRef}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:w-[28rem] md:justify-start"
            >
              {[
                { i: 1, name: "AI APP LABS" },
                { i: 2, name: "WHOP" },
              ].map(({ i, name }) => (
                <TickerIcon
                  key={i}
                  src={`/assets/clients/${i}.svg`}
                  alt={name}
                  name={name}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Desktop shader only */}
        <div
          ref={svgContainerRef}
          className="relative hidden w-full max-w-full items-center justify-center md:mt-0 md:flex md:w-auto md:max-w-[900px] md:justify-end"
        >
          <div
            className="hero-liquid-mask relative min-h-[336px] w-[90vw] max-w-[900px] overflow-hidden sm:w-[900px]"
            style={{ aspectRatio: "2.67" }}
          >
            <div className="absolute inset-0">
              {!prefersReducedMotion && shaderInView ? (
                <Shader />
              ) : (
                <ShaderFallback />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
