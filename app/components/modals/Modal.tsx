"use client";

import gsap from "gsap";
import React from "react";

import Calendar from "../calendar/Calendar";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "book-call" | "get-quote";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  initialTab = "book-call",
}) => {
  const [workModalOpen, setWorkModalOpen] = React.useState(
    () =>
      typeof document !== "undefined" &&
      document.body.classList.contains("workmodal-open")
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const check = () =>
      setWorkModalOpen(document.body.classList.contains("workmodal-open"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [isOpen]);
  const [selectedTab, setSelectedTab] = React.useState<
    "book-call" | "get-quote"
  >(initialTab);
  const [shouldLoadCalendar, setShouldLoadCalendar] = React.useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      return window.__calEmbedLoaded === true;
    }
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handleReady = () => setShouldLoadCalendar(true);
    window.addEventListener("calEmbedReady", handleReady);
    if (window.__calEmbedLoaded) {
      setShouldLoadCalendar(true);
    }
    return () => {
      window.removeEventListener("calEmbedReady", handleReady);
    };
  }, []);

  // Update selectedTab if initialTab changes while modal is open
  React.useEffect(() => {
    if (isOpen) setSelectedTab(initialTab);
  }, [initialTab, isOpen]);
  const [shouldRender, setShouldRender] = React.useState(isOpen);

  // Mount/unmount modal with animation and handle scroll locking with Lenis
  React.useEffect(() => {
    // Get Lenis instance from window
    const lenis = (
      window as unknown as {
        lenisInstance?: { stop: () => void; start: () => void };
      }
    ).lenisInstance;

    if (isOpen) {
      // Stop scrolling when modal opens
      if (lenis) {
        lenis.stop();
      }
      setShouldRender(true);
      setShouldLoadCalendar(true);
    } else if (shouldRender) {
      // Animate out, then unmount
      if (modalRef.current && backdropRef.current) {
        // Animate size out immediately
        gsap.to(modalRef.current, {
          width: 0,
          height: 0,
          borderRadius: 0,
          duration: 0.35,
          ease: "back.in(0.5)",
          onComplete: () => {
            setShouldRender(false);
            // Re-enable scrolling when modal closes
            if (lenis) {
              lenis.start();
            }
          },
        });
        gsap.to(backdropRef.current, { opacity: 0, duration: 0.15 });
      } else {
        setShouldRender(false);
        // Re-enable scrolling when modal closes
        if (lenis) {
          lenis.start();
        }
      }
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      if (lenis) {
        lenis.start();
      }
    };
  }, [isOpen, shouldRender]);

  // Force tab indicator to initialize when modal opens
  React.useEffect(() => {
    if (isOpen) {
      // Small delay to ensure tabs are rendered
      const timer = setTimeout(() => {
        // Find the active tab and force a resize event to recalculate indicator
        const activeTab = document.querySelector('[aria-selected="true"]');
        if (activeTab) {
          window.dispatchEvent(new Event("resize"));
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Animate in
  React.useLayoutEffect(() => {
    if (shouldRender && isOpen && modalRef.current && backdropRef.current) {
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(modalRef.current, {
        width: 0,
        height: 0,
        borderRadius: 0,
        opacity: 1,
      });
      // Animate size and borderRadius immediately
      // Use responsive height: higher on mobile for better form visibility
      const isMobile = window.innerWidth < 768;
      const viewportHeight = window.innerHeight;
      const bottomOffset = 88;

      // Calculate optimal height that fits within viewport
      let modalHeight = isMobile ? 720 : 640;
      const maxAvailableHeight = viewportHeight - bottomOffset - 20; // 20px top padding

      if (modalHeight > maxAvailableHeight) {
        modalHeight = maxAvailableHeight;
      }

      gsap.to(modalRef.current, {
        width: 480,
        height: modalHeight,
        borderRadius: 32,
        duration: 0.35,
        ease: "back.out(0.5)",
      });
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.15 });
    }
  }, [shouldRender, isOpen]);

  // Close modal on backdrop click or ESC
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const backdropRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-white/20 backdrop-blur-sm transition-all duration-75"
        style={{
          opacity: 0,
          zIndex: workModalOpen ? 100 : 40,
        }}
        onClick={(e) => {
          if (e.target === backdropRef.current) onClose();
        }}
      />
      {/* Modal */}
      <div
        ref={modalRef}
        className={`fixed bottom-[5.5rem] left-1/2 z-[9999] max-w-[calc(100vw-2rem)] origin-bottom -translate-x-1/2 overflow-auto p-6 text-gray-100 transition-colors duration-300 sm:w-[480px] ${
          selectedTab === "book-call" ? "bg-[#171717]" : "bg-gray-900"
        }`}
        style={{
          transformOrigin: "bottom center",
          width: 0,
          height: 0,
          borderRadius: 0,
          opacity: 0,
        }}
      >
        {/* Book Call Tab */}
        {selectedTab === "book-call" && (
          <div className="inset-0 flex h-full flex-col justify-between p-0">
            {shouldLoadCalendar ? (
              <Calendar namespace="intro-modal" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-black/30 p-6 text-center text-sm text-gray-200">
                <p className="font-medium text-gray-100">
                  Loading live availability…
                </p>
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Modal;
