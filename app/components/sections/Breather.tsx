"use client";

import type React from "react";
import { type ReactElement, useEffect, useMemo, useRef, useState } from "react";
import BreatherMobile from "./BreatherMobile";

declare global {
  interface Window {
    openBookCallModal?: (tab?: "book-call" | "get-quote") => void;
    isDesktopView?: boolean;
  }
}

import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Chat from "@/app/components/icons/Chat";
import Eye from "@/app/components/icons/Eye";
import Button from "@/app/components/ui/Button";

interface BreatherProps {
  onBookCall?: () => void;
  isWorkModalOpen?: boolean;
  setIsWorkModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const BreatherDesktop = ({
  onBookCall,
  setIsWorkModalOpen,
}: BreatherProps): ReactElement => {
  const [eyeOffset, setEyeOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const workBtn = document.getElementById("breather-latest-work-btn");
      if (!workBtn) return;
      const rect = workBtn.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
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
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  // Wrap specialPhrases in useMemo to avoid recreating the array on every render
  const specialPhrases = useMemo(
    () => ["the company.", "around it.", "Sound good?"],
    []
  );

  // Reference to the text container
  const textContainerRef = useRef<HTMLDivElement>(null);
  // Reference for the animated text
  const animatedTextRef = useRef<HTMLDivElement | null>(null);
  // Reference to the buttons container
  const buttonsRef = useRef<HTMLDivElement>(null);

  // We'll handle button animation in the scroll animation

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);
    if (!sectionRef.current || !stickyRef.current) return;

    // No special initialization needed

    // For horizontal scrolling with ReactLenis root=true, we need to set up the scroller properly
    // The horizontal scroll container is the #horizontal-scroll element
    let scroller: Element | null = document.querySelector("#horizontal-scroll");
    if (!scroller) {
      // Fallback to document.documentElement for ReactLenis root mode
      scroller = document.documentElement;
    }

    const lenisRaw =
      (window as unknown as { lenis?: unknown; lenisInstance?: unknown })
        .lenis ||
      (window as unknown as { lenisInstance?: unknown }).lenisInstance;
    let lenis:
      | {
          scrollTo?: (value: unknown, opts?: unknown) => void;
          scroll?: { instance: { scroll: { x: number } } };
          on?: (event: string, handler: () => void) => void;
          off?: (event: string, handler: () => void) => void;
        }
      | undefined;
    if (typeof lenisRaw === "object" && lenisRaw !== null) {
      lenis = lenisRaw as {
        scrollTo?: (value: unknown, opts?: unknown) => void;
        scroll?: { instance: { scroll: { x: number } } };
        on?: (event: string, handler: () => void) => void;
        off?: (event: string, handler: () => void) => void;
      };
    }
    let cleanupLenis: (() => void) | undefined;

    if (scroller && lenis) {
      // Set up scroller proxy for horizontal scrolling to work properly
      ScrollTrigger.scrollerProxy(scroller, {
        scrollLeft(value) {
          // biome-ignore lint/complexity/noArguments: GSAP scrollerProxy API requires arguments check
          if (arguments.length) {
            lenis?.scrollTo?.(value, { axis: "x" });
          }
          return (
            lenis?.scroll?.instance?.scroll?.x ??
            (scroller as HTMLElement).scrollLeft
          );
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });

      const onLenisScroll = () => ScrollTrigger.update();
      lenis?.on?.("scroll", onLenisScroll);
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      cleanupLenis = () => {
        lenis?.off?.("scroll", onLenisScroll);
        window.removeEventListener("resize", onResize);
      };
    }

    // Create animations with ScrollTrigger
    if (stickyRef.current && sectionRef.current && scroller) {
      // The breather section should remain sticky/fixed and not move vertically
      // Only the background color and text animations are handled by requestAnimationFrame
      // No GSAP animation on the container itself

      // ANIMATION FRAME APPROACH: Use requestAnimationFrame for continuous updates
      // This is the most reliable way to handle animations with scroll

      // We'll handle button animation in a separate useEffect

      // Function to update background color based on scroll position
      const updateBackgroundColor = () => {
        // Animate text color and opacity
        if (animatedTextRef.current) {
          // Calculate scroll progress as before
          if (!stickyRef.current || !sectionRef.current) return;
          const rect = sectionRef.current.getBoundingClientRect();
          const sectionWidth = rect.width;
          const viewportWidth = window.innerWidth;
          const totalScrollDistance = sectionWidth - viewportWidth;
          const scrolledDistance = Math.abs(rect.left);
          const progress = Math.min(1, scrolledDistance / totalScrollDistance);

          // Get all the spans in the text container
          const spans = animatedTextRef.current.querySelectorAll("span");

          // Process each span
          spans.forEach((span) => {
            const text = span.textContent || "";
            const isSpecialPhrase = specialPhrases.some((phrase) =>
              text.includes(phrase)
            );

            // Interpolate color from gray-500 (#6B7280) to #fff
            const from = [107, 114, 128]; // gray-500
            const to = [255, 255, 255]; // white
            const r = Math.round(from[0] + (to[0] - from[0]) * progress);
            const g = Math.round(from[1] + (to[1] - from[1]) * progress);
            const b = Math.round(from[2] + (to[2] - from[2]) * progress);

            // Set the color
            span.style.color = `rgb(${r},${g},${b})`;

            // Set the opacity based on whether it's a special phrase
            if (isSpecialPhrase) {
              span.style.opacity = "1"; // Special phrases stay at 100% opacity
            } else {
              const opacity = 1 - 0.5 * progress; // Regular text fades to 50% opacity
              span.style.opacity = opacity.toString();
            }
          });
        }

        if (!stickyRef.current || !sectionRef.current) return;

        // Get the section's position
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionWidth = rect.width;
        const viewportWidth = window.innerWidth;

        // Progress goes from 0 (start) to 1 (end)
        let progress = 0;

        // Reset text color to gray-500 by default
        if (textContainerRef.current) {
          textContainerRef.current.style.color = "#6b7280";
        }

        // Reset button opacity and position
        if (buttonsRef.current) {
          buttonsRef.current.style.opacity = "0";
          buttonsRef.current.style.transform = "translateY(20px)";
        }

        // Only calculate progress if section is at least partially visible
        if (rect.left <= viewportWidth && rect.right >= 0) {
          // Calculate how much of the section is in view (0 to 1)
          // 0 = just entering, 1 = fully in view
          const sectionInView = Math.min(
            1,
            (viewportWidth - rect.left) / viewportWidth
          );

          // Only start the color transition when the section is fully in view
          if (sectionInView >= 1) {
            // Now calculate how far we've scrolled through the section AFTER it's fully in view
            const totalScrollDistance = sectionWidth - viewportWidth;
            const scrolledDistance = Math.abs(rect.left);

            // Use the entire scroll distance for the animation
            // This will make the animation continue throughout the entire sticky section
            progress = Math.min(1, scrolledDistance / totalScrollDistance);
          } else {
            // Section not fully in view yet, keep the initial color
            progress = 0;

            // Explicitly set the text color back to gray-500 when not in view
            if (textContainerRef.current) {
              textContainerRef.current.style.color = "#6b7280";
            }
          }

          // Create a gradient that transitions based on progress
          const targetGradient =
            "radial-gradient(170.27% 100% at 50.04% 100%, #FFF 0%, #FF4502 40%, #F00 50%, #670030 100%), #000";

          // IMPORTANT: We need to maintain the sticky position
          // Make sure we don't change the position property

          // Check if we already have our gradient overlay element
          let gradientElement = document.getElementById("gradient-overlay");

          if (!gradientElement && progress > 0) {
            // Create a new element for the gradient
            gradientElement = document.createElement("div");
            gradientElement.id = "gradient-overlay";

            // Position it absolutely within the sticky container
            gradientElement.style.position = "absolute";
            gradientElement.style.top = "0";
            gradientElement.style.left = "0";
            gradientElement.style.right = "0";
            gradientElement.style.bottom = "0";
            gradientElement.style.width = "100%";
            gradientElement.style.height = "100%";

            // Set the gradient background
            gradientElement.style.background = targetGradient;

            // Make sure it's behind the content
            gradientElement.style.zIndex = "-1";

            // Start with opacity 0
            gradientElement.style.opacity = "0";

            // Add a slight transition for smoothness
            gradientElement.style.transition = "opacity 0.1s ease-out";

            // Make sure it doesn't interfere with mouse events
            gradientElement.style.pointerEvents = "none";

            // Add it to the DOM as the first child (so it's behind other content)
            if (stickyRef.current.firstChild) {
              stickyRef.current.insertBefore(
                gradientElement,
                stickyRef.current.firstChild
              );
            } else {
              stickyRef.current.appendChild(gradientElement);
            }
          }

          // Update the background colors based on progress
          if (progress === 0) {
            // At progress 0, use the solid gray color for the container
            stickyRef.current.style.backgroundColor = "#1f2937";

            // Hide the gradient overlay if it exists
            if (gradientElement) {
              gradientElement.style.opacity = "0";
            }

            // At progress 0, all text should be gray-500
            // No need to set anything here as the initial color is set via CSS class
          } else {
            // For progress > 0, fade in the gradient overlay
            if (gradientElement) {
              gradientElement.style.opacity = progress.toString();
            }

            // Animate text color from gray-500 to white based on progress
            // Calculate color between gray-500 (#6b7280) and white (#ffffff)
            const r = Math.round(107 + (255 - 107) * progress);
            const g = Math.round(114 + (255 - 114) * progress);
            const b = Math.round(128 + (255 - 128) * progress);
            const color = `rgb(${r}, ${g}, ${b})`;

            // Update the text container color based on progress
            if (textContainerRef.current) {
              textContainerRef.current.style.color = color;
            }

            // Update button opacity and position based on progress
            if (buttonsRef.current) {
              // Start showing buttons when progress is at 50% (0.5) and reach full opacity at 80% (0.8)
              const buttonProgress = Math.max(0, (progress - 0.5) * (1 / 0.3)); // Scale to get full opacity by 80% progress
              const clampedButtonProgress = Math.min(1, buttonProgress);

              // Apply the animation
              buttonsRef.current.style.opacity =
                clampedButtonProgress.toString();
              const translateY = 12 - clampedButtonProgress * 12; // 12px to 0px
              const blur = 24 - clampedButtonProgress * 24; // 24px to 0px
              buttonsRef.current.style.transform = `translateY(${translateY}px)`;
              buttonsRef.current.style.filter = `blur(${blur}px)`;
            }
          }
        }
      };

      // Set up animation frame loop for continuous updates
      let animationFrameId: number;

      const animationLoop = () => {
        // Update the background color
        updateBackgroundColor();

        // Continue the loop
        animationFrameId = requestAnimationFrame(animationLoop);
      };

      // Start the animation loop
      animationFrameId = requestAnimationFrame(animationLoop);

      // Also update on resize
      const onResizeColor = () => updateBackgroundColor();
      window.addEventListener("resize", onResizeColor);

      // Add cleanup for the animation frame and resize listener
      const originalCleanup = cleanupLenis;
      cleanupLenis = () => {
        if (originalCleanup) originalCleanup();

        // Cancel the animation frame
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }

        // Remove the resize listener
        window.removeEventListener("resize", onResizeColor);
      };
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      if (cleanupLenis) cleanupLenis();
      if (scroller) ScrollTrigger.scrollerProxy(scroller, undefined);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [specialPhrases]);

  return (
    <section
      ref={sectionRef}
      id="breather"
      className="relative h-[4000px] flex-shrink-0 bg-white md:h-full md:w-[4000px]"
    >
      <div
        ref={stickyRef}
        className="h-full"
        style={{
          position: "sticky",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100%",
          background: "#1f2937", // Initial gray-800 color (will be animated to gradient)
          zIndex: 1,
        }}
      >
        <div className="relative z-10 p-5 md:p-10 md:pb-24">
          <div ref={headingRef} className="relative z-10">
            <div
              ref={textContainerRef}
              className="heading-2-small max-w-2xl whitespace-pre-line"
            >
              <div ref={animatedTextRef} className="max-w-2xl">
                {/* First section */}
                <div className="mb-8">
                  <span className="block">You&apos;re building</span>
                  <span className="block">
                    <span className="special-phrase">the company.</span>
                  </span>
                </div>

                {/* Second section */}
                <div className="mb-8">
                  <span className="block">We&apos;re building everything</span>
                  <span className="block">
                    <span className="special-phrase">around it.</span>
                  </span>
                </div>

                {/* Third section */}
                <div>
                  <span className="block">
                    Design. Development. <br /> Shipped.
                  </span>
                  <span className="mb-8 block"></span>{" "}
                  {/* Empty line for spacing */}
                  <span className="block">
                    <span className="special-phrase">Sound good?</span>
                  </span>
                </div>
              </div>
            </div>

            <div ref={buttonsRef} className="mt-8 flex gap-2">
              <Button
                variant="primary"
                icon={<Chat fill="#fff" size={20} />}
                label="Book Call"
                onClick={() => {
                  if (onBookCall) {
                    onBookCall();
                  } else if (typeof window.openBookCallModal === "function") {
                    window.openBookCallModal();
                  }
                }}
              />
              <Button
                id="breather-latest-work-btn"
                variant="secondary"
                className="before:opacity-0"
                icon={
                  <Eye
                    innerEyeOffset={eyeOffset}
                    style={{ pointerEvents: "none" }}
                  />
                }
                label="Latest Work"
                onClick={() => {
                  setIsWorkModalOpen?.(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Breather = ({
  onBookCall,
  isWorkModalOpen,
  setIsWorkModalOpen,
}: BreatherProps): ReactElement => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we're on desktop or mobile
    const checkViewport = () => {
      // Use window.isDesktopView if available, otherwise check screen width
      if (typeof window.isDesktopView !== "undefined") {
        setIsDesktop(window.isDesktopView);
      } else {
        // Fallback to screen width check (768px is typical tablet/desktop breakpoint)
        setIsDesktop(window.innerWidth >= 768);
      }
    };

    // Initial check
    checkViewport();

    // Listen for resize events
    window.addEventListener("resize", checkViewport);

    return () => {
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  // Don't render anything until we know the viewport type
  if (isDesktop === null) {
    return <div></div>;
  }

  // Render appropriate component based on viewport
  return isDesktop ? (
    <BreatherDesktop
      onBookCall={onBookCall}
      isWorkModalOpen={isWorkModalOpen}
      setIsWorkModalOpen={setIsWorkModalOpen}
    />
  ) : (
    <BreatherMobile onBookCall={onBookCall} />
  );
};

export default Breather;
