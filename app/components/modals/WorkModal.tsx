"use client";

import gsap from "gsap";
import type { LenisRef } from "lenis/react";

import { ReactLenis } from "lenis/react";
import Image from "next/image";
import posthog from "posthog-js";
import React from "react";
import { projects as allProjects } from "@/app/data/projects";

const legacyProjects = allProjects.filter(
  (project) => !project.id.startsWith("work-")
);

import Masonry from "react-responsive-masonry";

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCall?: () => void;
}

/**
 * Full-screen modal that slides up from the bottom.
 * Displays a vertical, scrollable masonry list (2 columns) of projects.
 * No external UI libraries are used – only Tailwind utilities.
 */
const WorkModal: React.FC<WorkModalProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("workmodal-open");
      // Track work modal opened
      posthog.capture("work_modal_opened", {
        projects_count: legacyProjects.length,
      });
    } else {
      document.body.classList.remove("workmodal-open");
    }
    return () => {
      document.body.classList.remove("workmodal-open");
    };
  }, [isOpen]);
  // Use the same device detection logic as ScrollProvider
  const isDesktop = typeof window !== "undefined" && window.isDesktopView;

  const [shouldRender, setShouldRender] = React.useState(isOpen);
  // Infinite scroll: maintain a local state for grid items
  const [gridItems, setGridItems] = React.useState([...legacyProjects]);
  const [isFetching, setIsFetching] = React.useState(false);

  const backdropRef = React.useRef<HTMLDivElement>(null);
  const modalLenisRef = React.useRef<LenisRef | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  // Reset grid items when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setGridItems([...legacyProjects]);
    }
  }, [isOpen]);

  // Infinite scroll: append more items when near bottom
  React.useEffect(() => {
    if (!shouldRender || !isOpen) return;
    const container = modalLenisRef.current?.wrapper as HTMLDivElement | null;
    if (!container) return;
    const handleScroll = () => {
      if (
        container.scrollHeight - container.scrollTop - container.clientHeight <
          1500 &&
        !isFetching
      ) {
        setIsFetching(true);
        setTimeout(() => {
          setGridItems((prev) => [...prev, ...legacyProjects]);
          setIsFetching(false);
        }, 400); // simulate async fetch
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isFetching, shouldRender, isOpen]);

  /**
   * Custom Lenis modal scroll logic:
   * - When modal opens, stop main Lenis (window.lenisInstance) and create a new Lenis instance for the modal panel (window.workModalLenisInstance).
   * - When modal closes, destroy the modal Lenis and restart main Lenis.
   * - This ensures smooth vertical scroll inside the modal, without affecting the main horizontal scroll.
   */
  // Close modal on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    const mainLenis = (window as Window & { lenisInstance?: unknown })
      .lenisInstance;

    if (isOpen) {
      setShouldRender(true);
      // With ReactLenis, no manual Lenis instance or RAF needed. Just stop main Lenis if present.
      if (mainLenis && typeof mainLenis.stop === "function") mainLenis.stop();
    } else if (shouldRender) {
      // Animate out, then destroy modal Lenis and restart main Lenis
      if (backdropRef.current && modalLenisRef.current?.wrapper) {
        gsap.to(backdropRef.current, {
          opacity: 0,
          filter: "blur(24px)",
          duration: 0.22,
          ease: "power1.in",
        });
        gsap.to(modalLenisRef.current.wrapper, {
          opacity: 0,
          filter: "blur(24px)",
          duration: 0.22,
          ease: "power1.in",
          onComplete: () => {
            setShouldRender(false);
            // No manual Lenis cleanup needed with ReactLenis
            // Restart main Lenis if present
            if (mainLenis && typeof mainLenis.start === "function")
              mainLenis.start();
          },
        });
        if (closeBtnRef.current) {
          gsap.to(closeBtnRef.current, {
            opacity: 0,
            filter: "blur(24px)",
            duration: 0.22,
            ease: "power1.in",
          });
        }
      }
    }
    // Cleanup on unmount or effect re-run
    return () => {
      // No manual Lenis cleanup needed with ReactLenis
      if (!isOpen && mainLenis && typeof mainLenis.start === "function")
        mainLenis.start();
    };
  }, [isOpen, shouldRender]);

  // Animate in when mounted
  React.useLayoutEffect(() => {
    if (
      shouldRender &&
      isOpen &&
      backdropRef.current &&
      modalLenisRef.current?.wrapper
    ) {
      gsap.set(backdropRef.current, { opacity: 0, filter: "blur(24px)" });
      if (modalLenisRef.current?.wrapper) {
        gsap.set(modalLenisRef.current.wrapper, {
          opacity: 0,
          filter: "blur(24px)",
        });
      }
      if (closeBtnRef.current) {
        gsap.set(closeBtnRef.current, { opacity: 0, scale: 0.8 });
      }
      // Animate backdrop, modal, and close icon fade-in
      requestAnimationFrame(() => {
        gsap.to(backdropRef.current, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.15,
          ease: "power1.out",
        });
        if (modalLenisRef.current?.wrapper) {
          gsap.to(modalLenisRef.current.wrapper, {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.35,
            ease: "power1.out",
          });
        }
        if (closeBtnRef.current) {
          gsap.to(closeBtnRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          });
        }
      });
    }
  }, [shouldRender, isOpen]);

  // Animate only the first 10 image wrappers on modal open
  React.useEffect(() => {
    if (!shouldRender || !isOpen) return;
    if (!contentRef.current) return;
    const images = Array.from(
      contentRef.current.querySelectorAll(".workmodal-image-anim")
    );
    const animated = images.slice(0, 10);
    const rest = images.slice(10);
    animated.forEach((img) => gsap.set(img, { scale: 0.9, opacity: 0 }));
    rest.forEach((img) => gsap.set(img, { scale: 1, opacity: 1 }));
    if (animated.length > 0) {
      gsap.to(animated, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        stagger: 0.02,
        ease: "power2.out",
      });
    }
  }, [shouldRender, isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-white/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <button
        type="button"
        ref={closeBtnRef}
        aria-label="Close modal"
        onClick={onClose}
        className="fixed top-6 right-6 z-60 flex h-8 cursor-pointer flex-row items-center justify-center gap-0.5 rounded-full bg-gray-800/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-gray-700/60 md:py-2 md:pr-2 md:pl-2.5"
      >
        <span className="hidden items-center pt-[1px] text-xs font-semibold text-white select-none sm:inline-flex">
          ESC
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className="relative mt-auto h-full w-full overflow-hidden">
        {/* Modal Lenis config mirrors ScrollProvider for consistency */}
        <ReactLenis
          autoRaf
          ref={modalLenisRef}
          options={{
            orientation: "vertical", // Modal always scrolls vertically
            gestureOrientation: "vertical",
            smoothWheel: true, // Always enable smooth wheel for modal
            wheelMultiplier: 0.8,
            touchMultiplier: isDesktop ? 2 : 1,
            syncTouch: isDesktop,
            syncTouchLerp: 0.1,
            duration: 0.8, // Faster response, less "heavy" than default
            lerp: 0.18, // More responsive feel (default is 0.1)
            easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          }} // These values tuned for a lighter, more responsive modal scroll feel
          className="scrollbar-hide pointer-events-auto fixed top-0 bottom-0 left-0 z-50 flex h-[100svh] w-full max-w-none flex-col overflow-y-auto bg-white"
        >
          <div ref={contentRef} className="w-full p-4">
            <Masonry
              gutter="1rem"
              columnsCount={
                typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2
              }
            >
              {gridItems.map((project, idx) => (
                <div
                  key={`${project.id}-${idx}`}
                  className="workmodal-image-anim group relative w-full snap-start overflow-hidden rounded-2xl bg-gray-100"
                  style={
                    project.placeholderBackground
                      ? { background: project.placeholderBackground }
                      : undefined
                  }
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={600}
                      className="h-auto w-full object-cover"
                      quality={90}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      loading={idx < 12 ? "eager" : "lazy"}
                      placeholder={project.blurDataURL ? "blur" : "empty"}
                      blurDataURL={project.blurDataURL || undefined}
                    />
                  ) : (
                    <div className="aspect-video w-full bg-gray-100" />
                  )}
                  <div
                    className="absolute top-4 left-4 z-10 flex gap-1"
                    style={{ pointerEvents: "none" }}
                  >
                    {project.categories.map((cat) => (
                      <div
                        key={cat}
                        className={`pointer-events-none w-fit -translate-y-4 scale-90 rounded-full bg-gray-800/40 px-3 py-1.5 text-sm font-semibold text-white opacity-0 blur-[24px] filter transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Masonry>
            {isFetching && (
              <div className="py-4 text-center text-gray-400">
                Loading more...
              </div>
            )}
          </div>
        </ReactLenis>
      </div>
    </div>
  );
};

export default WorkModal;
