"use client";
import React from "react";

/**
 * GlobalAnimationPauseProvider
 * Pauses/resumes GSAP and Lenis globally on tab visibility change.
 * Place this at the top level of your app (in layout.tsx).
 */
export default function GlobalAnimationPauseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const handleVisibility = () => {
      // Pause/resume GSAP global timeline
      if (
        typeof window !== "undefined" &&
        window.gsap &&
        window.gsap.globalTimeline
      ) {
        if (document.hidden) {
          window.gsap.globalTimeline.pause();
        } else {
          window.gsap.globalTimeline.resume();
        }
      }
      // Pause/resume main Lenis instance
      const mainLenis = (
        window as typeof window & {
          lenisInstance?: { stop?: () => void; start?: () => void };
        }
      ).lenisInstance;
      if (
        mainLenis &&
        typeof mainLenis.stop === "function" &&
        typeof mainLenis.start === "function"
      ) {
        if (document.hidden) {
          mainLenis.stop();
        } else {
          mainLenis.start();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
  return <>{children}</>;
}
