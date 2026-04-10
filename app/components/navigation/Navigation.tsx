import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import posthog from "posthog-js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Chat from "@/app/components/icons/Chat";
import Logo from "@/app/components/icons/Logo";
import PlansIcon from "@/app/components/icons/navigation/Plans";
import ServicesIcon from "@/app/components/icons/navigation/Services";
import WorkIcon from "@/app/components/icons/navigation/Work";
import Telegram from "@/app/components/icons/Telegram";
import Modal from "@/app/components/modals/Modal";
import WorkModal from "@/app/components/modals/WorkModal";
import Button from "@/app/components/ui/Button";

declare global {
  interface Window {
    openBookCallModal?: (tab?: "book-call" | "get-quote") => void;
    __heroAnimationComplete?: boolean;
  }
}

import TestimonialsIcon from "@/app/components/icons/navigation/Testimonials";

interface NavigationItem {
  key: string;
  title: string;
  icon: (props: { fill: string }) => React.ReactNode;
  alt: string;
}

const navigationItems: NavigationItem[] = [
  {
    key: "hero",
    title: "",
    icon: (props) => <Logo width={32} height={12} {...props} />,
    alt: "Go to hero section",
  },
  {
    key: "services",
    title: "Services",
    icon: ({ fill }) => <ServicesIcon fill={fill} />, // 20px default in SVG
    alt: "Services icon",
  },
  {
    key: "work",
    title: "Work",
    icon: ({ fill }) => <WorkIcon fill={fill} />, // 20px default in SVG
    alt: "Work icon",
  },
  {
    key: "testimonials",
    title: "Testimonials",
    icon: ({ fill }) => <TestimonialsIcon fill={fill} />, // 20px default in SVG
    alt: "Testimonials icon",
  },
  {
    key: "plans",
    title: "Plans",
    icon: ({ fill }) => <PlansIcon fill={fill} />, // 20px default in SVG
    alt: "Plans icon",
  },
];

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
  gsap.registerPlugin(ScrollTrigger);
}

interface NavigationProps {
  onBookCall?: () => void;
}

export default function Navigation({ onBookCall }: NavigationProps) {
  // State to control visibility of Book Call button
  const bookCallButtonRef = useRef<
    HTMLButtonElement & { _originalStyles?: unknown }
  >(null);
  // Ref for nav container entry animation
  const navRef = useRef<HTMLDivElement>(null);

  // Animate nav bar only after hero animation is complete
  const hasAnimated = React.useRef(false);
  React.useEffect(() => {
    const animateNav = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      if (navRef.current) {
        gsap.fromTo(
          navRef.current,
          { opacity: 0, y: 48, filter: "blur(24px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power1.out",
            onComplete: () => {
              window.dispatchEvent(new Event("navigationAnimationComplete"));
            },
          }
        );
      }
    };
    if (typeof window !== "undefined" && window.__heroAnimationComplete) {
      if (navRef.current) {
        gsap.set(navRef.current, { opacity: 1, y: 0, filter: "blur(0px)" });
      }
      hasAnimated.current = true;
    } else {
      window.addEventListener("heroAnimationComplete", animateNav);
      return () =>
        window.removeEventListener("heroAnimationComplete", animateNav);
    }
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  const telegramButtonRef = useRef<
    HTMLButtonElement & { _originalStyles?: unknown }
  >(null);

  // Local state to track the selected tab
  const [selectedTab, setSelectedTab] = useState("work");
  // Popover state for Book Call
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Work modal state (opens on mobile when tapping Work)
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  // Use a ref to immediately store scroll position without triggering re-render
  const savedScrollRef = useRef({ x: 0, y: 0 });

  // Reference to store ScrollTrigger instances
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  // Flag to prevent ScrollTrigger from updating during programmatic scrolling
  const isScrolling = useRef(false);
  // Reference for the active tab indicator
  const tabIndicatorRef = useRef<HTMLDivElement>(null);

  // Function to animate the tab indicator with smoother transitions
  const animateTabIndicator = useCallback((tabId: string) => {
    const indicator = tabIndicatorRef.current;
    const targetTab = document.getElementById(`tab-${tabId}`);

    if (!indicator || !targetTab) {
      return;
    }

    if (tabId === "hero" || tabId === "past-plans" || tabId === "") {
      gsap.to(indicator, {
        scale: 0,
        opacity: 0,
        width: 0,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
      return;
    }

    const tabRect = targetTab.getBoundingClientRect();
    const indicatorParent = indicator.parentElement;
    const parentRect = indicatorParent?.getBoundingClientRect() || { left: 0 };

    const tl = gsap.timeline({
      defaults: { ease: "power2.out", duration: 0.3 },
      overwrite: "auto",
    });

    tl.to(indicator, {
      x: tabRect.left - parentRect.left,
      width: tabRect.width,
      scale: 1,
      opacity: 1,
    });
  }, []);

  // Hide nav initially and animate in after Hero completes
  useEffect(() => {
    const navEl = navRef.current;
    if (navEl) {
      gsap.set(navEl, {
        opacity: 0,
        y: 50, // Start 50px below final position
        filter: "blur(12px)",
        transformOrigin: "center bottom",
      });
    }
    // Set up global function to open the modal
    window.openBookCallModal = () => {
      // Save scroll position
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      savedScrollRef.current = { x: scrollX, y: scrollY };
      setIsModalOpen(true);
      // Restore position in next tick
      setTimeout(() => {
        window.scrollTo(scrollX, scrollY);
      }, 0);
    };

    const onHeroComplete = () => {
      if (navEl) {
        // Match Hero component timing for consistency
        gsap.to(navEl, {
          y: 0, // Animate to final position
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.inOut", // Smoother entrance
        });
      }
    };
    window.addEventListener("heroAnimComplete", onHeroComplete);
    return () => window.removeEventListener("heroAnimComplete", onHeroComplete);
  }, []);

  // Set up ScrollTrigger for each section and animate bottom navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Kill existing ScrollTriggers to prevent duplicates
    scrollTriggersRef.current.forEach((trigger) => trigger.kill());
    scrollTriggersRef.current = [];

    // Create triggers for each navigation item
    navigationItems.forEach((item) => {
      const sectionId = item.key;
      const section = document.getElementById(sectionId);
      if (!section) {
        return;
      }
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "left center",
        end: "right center",
        horizontal: true,
        onEnter: () => {
          if (!isScrolling.current) {
            setSelectedTab(sectionId);
            animateTabIndicator(sectionId);
          }
        },
        onEnterBack: () => {
          if (!isScrolling.current) {
            setSelectedTab(sectionId);
            animateTabIndicator(sectionId);
          }
        },
      });
      scrollTriggersRef.current.push(trigger);
    });

    // Add a special trigger for detecting when we've scrolled past the plans section
    const plansSection = document.getElementById("plans");
    if (plansSection) {
      const pastPlansTrigger = ScrollTrigger.create({
        trigger: plansSection,
        start: "right center", // When the right edge of plans passes the center
        horizontal: true,
        onEnter: () => {
          if (!isScrolling.current) {
            // We've scrolled past the plans section
            setSelectedTab("");
            animateTabIndicator(""); // This will now scale down to 0
          }
        },
        onLeaveBack: () => {
          if (!isScrolling.current) {
            // We've scrolled back to the plans section
            setSelectedTab("plans");
            animateTabIndicator("plans");
          }
        },
      });
      scrollTriggersRef.current.push(pastPlansTrigger);
    }

    // Initialize the tab indicator for the current tab
    setTimeout(() => {
      animateTabIndicator(selectedTab);
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];
    };
  }, [selectedTab, animateTabIndicator]);

  // Dedicated effect for Book Call button visibility
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Add a small delay to ensure Lenis is fully initialized
    const initTimeout = setTimeout(() => {
      // Get references to DOM elements
      const button = bookCallButtonRef.current;
      const telegramBtn = telegramButtonRef.current;
      const content = contentRef.current;

      if (!button || !telegramBtn || !content) return;

      // Set initial state
      gsap.set(button, { scale: 1, autoAlpha: 1, display: "" });

      // Store original button dimensions
      const original = {
        width: button.offsetWidth,
        paddingLeft: window.getComputedStyle(button).paddingLeft,
        paddingRight: window.getComputedStyle(button).paddingRight,
        marginLeft: window.getComputedStyle(button).marginLeft,
        marginRight: window.getComputedStyle(button).marginRight,
      };

      const telegramOriginal = {
        width: telegramBtn.offsetWidth,
        paddingLeft: window.getComputedStyle(telegramBtn).paddingLeft,
        paddingRight: window.getComputedStyle(telegramBtn).paddingRight,
        marginLeft: window.getComputedStyle(telegramBtn).marginLeft,
        marginRight: window.getComputedStyle(telegramBtn).marginRight,
      };

      button._originalStyles = original;
      telegramBtn._originalStyles = telegramOriginal;

      // Animation state
      let animating = false;
      let actionsVisible = true; // assume visible at start so initial hide works

      // Animation function for Book Call and Telegram buttons only
      const animateActions = (show: boolean) => {
        if (animating || show === actionsVisible) return; // abort if already in desired state or animating
        actionsVisible = show;
        animating = true;
        const actions = [
          bookCallButtonRef.current,
          telegramButtonRef.current,
        ].filter(Boolean);
        const currentTl = gsap.timeline({
          onComplete: () => {
            animating = false;
          },
        });
        if (show) {
          // Only animate width if previously hidden, otherwise animate scale/opacity/blur for smoothness
          type AnimatedButton = HTMLButtonElement & {
            _originalStyles?: { [key: string]: string | number | undefined };
          };
          (actions.filter(Boolean) as AnimatedButton[]).forEach((action) => {
            if (action._originalStyles) {
              gsap.set(action, {
                width: 0,
                paddingLeft: 0,
                paddingRight: 0,
                marginLeft: 0,
                marginRight: 0,
                autoAlpha: 0,
                scale: 0.8,
                filter: "blur(12px)",
              });
              gsap.to(action, {
                width: action._originalStyles.width,
                paddingLeft: action._originalStyles.paddingLeft,
                paddingRight: action._originalStyles.paddingRight,
                marginLeft: action._originalStyles.marginLeft,
                marginRight: action._originalStyles.marginRight,
                autoAlpha: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.62,
                ease: "power2.inOut",
                clearProps:
                  "width,paddingLeft,paddingRight,marginLeft,marginRight",
                stagger: 0.13,
              });
            }
          });
        } else {
          currentTl.to(actions, {
            autoAlpha: 0,
            scale: 0.8,
            width: 0,
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 0,
            marginRight: 0,
            filter: "blur(12px)",
            duration: 0.48,
            stagger: 0.09,
            ease: "power2.inOut",
          });
        }
      };

      // Handler functions
      const hideButton = () => animateActions(false);
      const showButton = () => animateActions(true);

      // Create ScrollTrigger for Services section
      const servicesSection = document.getElementById("services");
      if (!servicesSection) return;

      // Also select Book Call section to hide buttons within it
      const bookCallSection = document.getElementById("book-call");

      // Hide buttons by default (hero is initially visible)
      hideButton();

      // Horizontal trigger for desktop view
      const horizontalTrigger = ScrollTrigger.create({
        trigger: servicesSection,
        // Don't specify scroller for default behavior with ReactLenis root=true
        horizontal: true,
        start: "left center",
        end: "right center",
        onEnter: showButton,
        onEnterBack: showButton,
        invalidateOnRefresh: true,
      });

      // Create a vertical trigger for mobile views
      const verticalTrigger = ScrollTrigger.create({
        trigger: servicesSection,
        // Don't specify scroller for default behavior with ReactLenis root=true
        horizontal: false,
        start: "top 60%", // Adjusted to trigger a bit earlier
        end: "bottom 40%", // Adjusted to maintain trigger a bit longer
        markers: false, // Set to true for debugging
        onEnter: showButton,
        onEnterBack: showButton,
        invalidateOnRefresh: true,
      });

      // --- Book Call section triggers (hide buttons inside) ---
      let bcHorizontalTrigger: ScrollTrigger | null = null;
      let bcVerticalTrigger: ScrollTrigger | null = null;
      if (bookCallSection) {
        bcHorizontalTrigger = ScrollTrigger.create({
          trigger: bookCallSection,
          horizontal: true,
          start: "left center",
          end: "right center",
          onEnter: hideButton,
          onEnterBack: hideButton,
          onLeave: showButton,
          onLeaveBack: showButton,
          invalidateOnRefresh: true,
        });

        bcVerticalTrigger = ScrollTrigger.create({
          trigger: bookCallSection,
          horizontal: false,
          start: "top 60%",
          end: "bottom 40%",
          markers: false,
          onEnter: hideButton,
          onEnterBack: hideButton,
          onLeave: showButton,
          onLeaveBack: showButton,
          invalidateOnRefresh: true,
        });
      }

      // --- Hero section triggers (re-hide when returning) ---
      const heroSection = document.getElementById("hero");
      let heroHorizontalTrigger: ScrollTrigger | null = null;
      let heroVerticalTrigger: ScrollTrigger | null = null;
      if (heroSection) {
        heroHorizontalTrigger = ScrollTrigger.create({
          trigger: heroSection,
          horizontal: true,
          start: "left center",
          end: "right center",
          onEnter: hideButton,
          onEnterBack: hideButton,
          onLeave: showButton,
          onLeaveBack: showButton,
          invalidateOnRefresh: true,
        });

        heroVerticalTrigger = ScrollTrigger.create({
          trigger: heroSection,
          horizontal: false,
          start: "top 60%",
          end: "bottom 40%",
          markers: false,
          onEnter: hideButton,
          onEnterBack: hideButton,
          onLeave: showButton,
          onLeaveBack: showButton,
          invalidateOnRefresh: true,
        });
      }

      // Enable/disable triggers based on screen width
      const updateTriggers = () => {
        const isDesktop = window.innerWidth >= 768;
        // Services triggers
        if (isDesktop) {
          horizontalTrigger.enable();
          verticalTrigger.disable();
        } else {
          horizontalTrigger.disable();
          verticalTrigger.enable();
        }
        // Book Call triggers
        if (bookCallSection && bcHorizontalTrigger && bcVerticalTrigger) {
          if (isDesktop) {
            bcHorizontalTrigger.enable();
            bcVerticalTrigger.disable();
          } else {
            bcHorizontalTrigger.disable();
            bcVerticalTrigger.enable();
          }
        }
        // Hero triggers
        if (heroSection && heroHorizontalTrigger && heroVerticalTrigger) {
          if (isDesktop) {
            heroHorizontalTrigger.enable();
            heroVerticalTrigger.disable();
          } else {
            heroHorizontalTrigger.disable();
            heroVerticalTrigger.enable();
          }
        }
      };

      // Initial setup
      updateTriggers();

      // Update on resize
      window.addEventListener("resize", updateTriggers);

      return () => {
        horizontalTrigger.kill();
        verticalTrigger.kill();
        if (bcHorizontalTrigger) bcHorizontalTrigger.kill();
        if (bcVerticalTrigger) bcVerticalTrigger.kill();
        if (heroHorizontalTrigger) heroHorizontalTrigger.kill();
        if (heroVerticalTrigger) heroVerticalTrigger.kill();
        window.removeEventListener("resize", updateTriggers);
      };
    }, 500); // Delay to ensure Lenis is initialized

    return () => {
      clearTimeout(initTimeout);
    };
  }, []);

  // This function will be called when the user changes tabs
  const handleTabChange = useCallback(
    (key: string | number) => {
      const sectionId = key.toString();

      // Track nav section clicked
      if (sectionId !== "hero") {
        posthog.capture("nav_section_clicked", {
          section: sectionId,
          is_mobile: window.innerWidth < 768,
        });
      }

      // Update local state and animate tab indicator immediately
      setSelectedTab(sectionId);
      animateTabIndicator(sectionId);

      // Check if we're on mobile or desktop
      const isMobile = window.innerWidth < 768;

      // On mobile, open Work modal instead of scrolling to the Work section
      if (isMobile && sectionId === "work") {
        setIsWorkModalOpen(true);
        // do not scroll to the section
        return;
      }

      // Find the section element
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) {
        return;
      }

      // Set scrolling flag to prevent ScrollTrigger from updating during programmatic scrolling
      isScrolling.current = true;

      // Get the section's position
      const sectionRect = sectionElement.getBoundingClientRect();

      if (isMobile) {
        // Mobile: Vertical scrolling
        const targetY = window.scrollY + sectionRect.top - 100; // Add offset to position better

        // Use GSAP ScrollTo for smooth vertical scrolling
        gsap.to(window, {
          duration: 0.35,
          scrollTo: { y: targetY },
          ease: "power2.out",
          onComplete: () => {
            // Reset scrolling flag after animation completes
            setTimeout(() => {
              isScrolling.current = false;
            }, 500);
          },
        });
      } else {
        // Desktop: Horizontal scrolling
        const targetX = window.scrollX + sectionRect.left;

        // Use GSAP ScrollTo for smooth horizontal scrolling
        gsap.to(window, {
          duration: 0.35,
          scrollTo: { x: targetX },
          ease: "power2.out",
          onComplete: () => {
            // Reset scrolling flag after animation completes
            setTimeout(() => {
              isScrolling.current = false;
            }, 500);
          },
        });
      }
    },
    [animateTabIndicator]
  );

  // Effect to initialize the tab indicator position
  useEffect(() => {
    // Set initial position after a short delay to ensure DOM is ready
    setTimeout(() => {
      animateTabIndicator(selectedTab);
    }, 500);
  }, [animateTabIndicator, selectedTab]);

  // Modal is now controlled directly through the UI

  return (
    <>
      <div
        ref={navRef}
        className="bottom-nav-container fixed right-0 bottom-6 left-0 z-50 m-auto flex w-fit cursor-pointer flex-col"
        onClick={() => isModalOpen && setIsModalOpen(false)}
      >
        <div
          ref={contentRef}
          className="border-gradient-inner flex h-full w-full items-center overflow-hidden rounded-full bg-white p-1"
          style={{
            borderRadius: "9999px",
            boxShadow:
              "0px 20px 20px 0px rgba(25, 27, 36, 0.03), 0px 5px 11px 0px rgba(25, 27, 36, 0.03)",
            boxSizing: "border-box",
          }}
        >
          {/* Nav Content (Tabs & actions) */}
          <div className="flex flex-1 justify-center">
            <div
              role="tablist"
              aria-label="Navigation"
              className="relative flex bg-transparent pr-1"
            >
              {/* Custom active tab indicator */}
              <div
                ref={tabIndicatorRef}
                className="border-gradient-inner !absolute rounded-full bg-white shadow-[0_2px_4px_0_rgba(25,27,36,0.04)]"
                style={{
                  height: "100%",
                  width: "0",
                  left: "0",
                  top: "0",
                  transform: "scale(0)",
                  pointerEvents: "none",
                  zIndex: 0,
                  opacity: 0,
                }}
              />
              {/* Tab buttons */}
              {navigationItems.map((item) => {
                const baseClasses =
                  "relative z-10 cursor-pointer rounded-full font-semibold transition-colors duration-300";
                const activeClasses = "text-gray-800"; // Add any Tailwind classes for active tab here
                const paddingClasses =
                  item.key === "hero"
                    ? "py-1.5 pr-3 pl-4"
                    : "py-1.5 pr-3 pl-[10px]";
                const hiddenClasses = [
                  "services",
                  "testimonials",
                  "plans",
                ].includes(item.key)
                  ? "hidden md:flex"
                  : "";
                const isActive =
                  item.key !== "hero" && selectedTab === item.key;
                const hasVisibleLabel = Boolean(item.title?.trim());
                return (
                  <button
                    type="button"
                    key={item.key}
                    role="tab"
                    aria-selected={selectedTab === item.key}
                    aria-controls={`panel-${item.key}`}
                    id={`tab-${item.key}`}
                    aria-label={hasVisibleLabel ? undefined : item.alt}
                    className={[
                      baseClasses,
                      paddingClasses,
                      isActive ? activeClasses : "text-gray-500",
                      hiddenClasses,
                    ].join(" ")}
                    onClick={() => handleTabChange(item.key)}
                  >
                    <div className="flex items-center gap-1">
                      <div className="relative flex items-center justify-center">
                        {item.key === "hero"
                          ? item.icon({ fill: "var(--color-brand)" })
                          : item.icon({
                              fill:
                                selectedTab === item.key
                                  ? "#FF4502"
                                  : "#9D9FAE",
                            })}
                      </div>
                      {item.key !== "hero" && (
                        <span className="text-sm font-semibold">
                          {item.title}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Right: Action buttons */}
          <div className="flex items-center">
            <Button
              ref={bookCallButtonRef}
              variant="primary"
              icon={<Chat fill="#fff" size={20} className="min-w-[20px]" />}
              className="whitespace-nowrap"
              size="sm"
              label="Book Call"
              style={{ minWidth: 0 }}
              onClick={() => {
                // Track book call modal opened
                posthog.capture("book_call_modal_opened", {
                  source: "navigation",
                });
                // Save scroll position
                const scrollX = window.scrollX;
                const scrollY = window.scrollY;
                savedScrollRef.current = { x: scrollX, y: scrollY };
                if (onBookCall) {
                  onBookCall();
                }
                // Restore position in next tick
                setTimeout(() => {
                  window.scrollTo(scrollX, scrollY);
                }, 0);
              }}
              aria-label="Book Call"
            />
            <button
              type="button"
              ref={telegramButtonRef}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
              aria-label="Join us on Telegram"
              tabIndex={0}
              style={{ minWidth: 0 }}
              onClick={() => {
                // Track Telegram link clicked
                posthog.capture("telegram_link_clicked", {
                  source: "navigation",
                });
                window.open(
                  "https://t.me/jessevermeulen",
                  "_blank",
                  "noopener noreferrer"
                );
              }}
            >
              <Telegram width={22} height={22} />
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <WorkModal
        isOpen={isWorkModalOpen}
        onClose={() => setIsWorkModalOpen(false)}
      />
    </>
  );
}
