"use client";

/* eslint-disable @next/next/no-img-element */

import gsap from "gsap";
import React, { useEffect, useMemo, useRef } from "react";

interface TickerProps {
  /** elements to render inside ticker (e.g. icons) */
  children?: React.ReactNode;
  /** seconds for one loop */
  duration?: number;
  /** additional classes for the duplicated item wrappers */
  itemClassName?: string;

  /** enable edge fade with gradient */
  fade?: boolean;
  /** width of fade (px) */
  fadeWidth?: number;
  /** when true, automatically loads all SVGs from /assets/clients/1.svg..n.svg */
  clients?: boolean;
}

/**
 * A seamless marquee / ticker that scrolls its children from right → left.
 * Children are duplicated to avoid gaps. No interaction needed – pure CSS keyframe
 * animation is created dynamically to match container width.
 */
const Ticker: React.FC<TickerProps> = ({
  children,
  duration = 15,
  itemClassName,

  fade = true,
  fadeWidth = 64,
  clients = false,
}) => {
  // Build content list
  const content = useMemo(() => {
    if (clients) {
      // Assuming files named 1.svg…9.svg in /public/assets/clients
      const count = 6;
      return Array.from({ length: count }, (_, i) => (
        <TickerIcon
          key={i}
          src={`/assets/clients/${i + 1}.svg`}
          // className="opacity-70 transition-opacity hover:opacity-100"
        />
      ));
    }
    return children;
  }, [clients, children]);

  // Build duplicated content (two sets)
  const duplicated = React.useMemo(() => {
    const arr = React.Children.toArray(content);
    const dup = [...arr, ...arr].map((child, i) => (
      <div
        key={i}
        className={`flex shrink-0 items-center ${itemClassName ?? ""}`}
      >
        {child}
      </div>
    ));
    return dup;
  }, [content, itemClassName]);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const progressRef = useRef(0);

  const setupTween = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    // Save progress before killing
    if (tweenRef.current) {
      progressRef.current = tweenRef.current.progress();
      tweenRef.current.kill();
    }
    gsap.set(el, { xPercent: 0 });

    tweenRef.current = gsap.to(el, {
      xPercent: -50,
      duration,
      ease: "none",
      repeat: -1,
      modifiers: {
        xPercent: gsap.utils.wrap(-100, 0), // wrap between -100 and 0
      },
      onStart: function () {
        // Restore previous progress
        if (progressRef.current) {
          this.progress(progressRef.current);
        }
      },
    });
  }, [duration]);

  useEffect(() => {
    setupTween();

    // Copy ref for correct cleanup
    const container = containerRef.current;
    const slow = () => tweenRef.current?.timeScale(0.5);
    const normal = () => tweenRef.current?.timeScale(1);
    container?.addEventListener("mouseenter", slow);
    container?.addEventListener("mouseleave", normal);

    // Re-init on resize to handle orientation changes etc.
    window.addEventListener("resize", setupTween);

    return () => {
      tweenRef.current?.kill();
      container?.removeEventListener("mouseenter", slow);
      container?.removeEventListener("mouseleave", normal);
      window.removeEventListener("resize", setupTween);
    };
  }, [setupTween]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={
        fade
          ? {
              WebkitMaskImage: `linear-gradient(to right, transparent 0, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)`,
              maskImage: `linear-gradient(to right, transparent 0, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)`,
            }
          : undefined
      }
    >
      <div
        ref={trackRef}
        className="inline-flex items-center"
        style={{ minWidth: "max-content" }}
      >
        {duplicated}
      </div>
    </div>
  );
};

interface IconProps {
  src: string;

  className?: string;
  alt?: string;
}

/**
 * Icon component that auto-calculates width to keep optical size consistent
 */
export const TickerIcon: React.FC<IconProps> = ({
  src,
  className = "",
  alt = "",
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        display: "block",
      }}
      loading="lazy"
      decoding="async"
    />
  );
};

export default Ticker;
