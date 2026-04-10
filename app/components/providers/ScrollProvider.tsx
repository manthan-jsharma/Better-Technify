"use client";

import type Lenis from "lenis";
import type { LenisRef } from "lenis/react";
import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

// Custom animation frame utilities to replace framer-motion
const requestAnimationFrame =
  typeof window !== "undefined"
    ? window.requestAnimationFrame
    : (callback: FrameRequestCallback) => setTimeout(callback, 1000 / 60);
const cancelAnimationFrame =
  typeof window !== "undefined" ? window.cancelAnimationFrame : clearTimeout;

// Define global variables to store the Lenis instance and viewport state
declare global {
  interface Window {
    lenisInstance?: Lenis; // optional property
    isDesktopView?: boolean; // track viewport state globally
  }
}

const LenisContext = createContext<React.RefObject<LenisRef | null> | null>(
  null
);
export const useLenis = () => useContext(LenisContext);

// ScrollProvider component with responsive behavior
export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [lenisReady, setLenisReady] = useState(false);
  const [LenisComponent, setLenisComponent] = useState<
    typeof import("lenis/react")["ReactLenis"] | null
  >(null);
  const [forcedOrientation, setForcedOrientation] = useState<
    "horizontal" | "vertical" | null
  >(null);
  const [lenisDisabled, setLenisDisabled] = useState(false);

  // Track previous viewport state to detect changes
  const prevIsDesktopRef = useRef<boolean | null>(null);

  // Detect viewport size and set isDesktop state
  useEffect(() => {
    if (typeof window === "undefined" || !lenisReady) return;

    function handleResize() {
      const isDesktopView = window.matchMedia("(min-width: 768px)").matches;
      setIsDesktop(isDesktopView);

      // Store viewport state globally for access in other components
      window.isDesktopView = isDesktopView;

      // Reset scroll position when switching between modes
      if (
        prevIsDesktopRef.current !== null &&
        prevIsDesktopRef.current !== isDesktopView
      ) {
        // Use a slight delay to ensure DOM has updated
        setTimeout(() => {
          // Reset scroll using Lenis if available
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(0, { immediate: true });
          }

          // Also reset native scroll as a fallback
          window.scrollTo(0, 0);

          // If we have a horizontal scroll container, reset its scroll position too
          const scrollContainer = document.getElementById("horizontal-scroll");
          if (scrollContainer) {
            scrollContainer.scrollLeft = 0;
          }
        }, 50);
      }

      // Update previous state reference
      prevIsDesktopRef.current = isDesktopView;
    }

    // Initial check
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [lenisReady]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    const readAttrs = () => {
      const attr = root.dataset.lenisOrientation;
      if (attr === "horizontal" || attr === "vertical") {
        setForcedOrientation(attr);
      } else {
        setForcedOrientation(null);
      }
      setLenisDisabled(root.dataset.lenisDisabled === "true");
    };

    readAttrs();

    const observer = new MutationObserver(() => {
      readAttrs();
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-lenis-orientation", "data-lenis-disabled"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Setup Lenis animation frame
  useEffect(() => {
    if (!lenisReady) return;
    let frameId: number;

    function update(time: number) {
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.raf(time);
      }
      frameId = requestAnimationFrame(update);
    }

    // Start the animation loop
    frameId = requestAnimationFrame(update);

    // Make the Lenis instance globally available after a short delay
    const initTimeout = setTimeout(() => {
      if (lenisRef.current?.lenis) {
        window.lenisInstance = lenisRef.current.lenis;
      }
    }, 500);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(initTimeout);

      // Clean up Lenis
      if (window.lenisInstance !== undefined) {
        delete window.lenisInstance;
      }
    };
  }, [lenisReady]);

  useEffect(() => {
    if (lenisReady) return;
    if (typeof window === "undefined") {
      setLenisReady(true);
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;
    let idleHandle: number | null = null;

    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(
        () => {
          if (!cancelled) {
            setLenisReady(true);
          }
        },
        { timeout: 500 }
      );
    } else {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          setLenisReady(true);
        }
      }, 160);
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
  }, [lenisReady]);

  useEffect(() => {
    if (!lenisReady || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLenisComponent(null);
      return;
    }

    let cancelled = false;

    import("lenis/react")
      .then((mod) => {
        if (!cancelled) {
          setLenisComponent(() => mod.ReactLenis);
        }
      })
      .catch(() => {
        // Gracefully degrade to native scrolling when Lenis fails to load
        setLenisComponent(null);
      });

    return () => {
      cancelled = true;
    };
  }, [lenisReady]);

  const orientation =
    forcedOrientation ?? (isDesktop ? "horizontal" : "vertical");
  const isHorizontal = orientation === "horizontal";
  const lenisKey = `${orientation}-${isDesktop ? "desktop" : "mobile"}`;

  return (
    <LenisContext.Provider value={lenisRef}>
      {LenisComponent && !lenisDisabled ? (
        <LenisComponent
          key={lenisKey}
          root
          autoRaf={false}
          options={{
            orientation,
            gestureOrientation: isHorizontal ? "both" : "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.8,
            touchMultiplier: isHorizontal && isDesktop ? 2 : 1,
            syncTouch: isHorizontal && isDesktop,
            syncTouchLerp: 0.1,
            duration: isHorizontal ? 1.2 : 0.8,
            ...(isHorizontal ? {} : { lerp: 0.18 }),
            easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          }}
          ref={lenisRef}
        >
          {children}
        </LenisComponent>
      ) : (
        children
      )}
    </LenisContext.Provider>
  );
}
