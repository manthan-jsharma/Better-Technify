"use client";

import { useEffect, useRef, useState } from "react";
import content from "@/app/data/content.json";

import Calendar from "../calendar/Calendar";
import Testimonial from "../ui/Testimonial";

const BookCallSection = () => {
  const [selectedTab] = useState<string>("book-call");
  const [shouldLoadCalendar, setShouldLoadCalendar] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.__calEmbedLoaded === true;
  });
  // Load the 8th testimonial from testimonials.columns (index 7)
  const testimonial = content.testimonials.columns[7];

  // Refs for tab content elements

  // Refs for elements
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (shouldLoadCalendar) return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadCalendar(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoadCalendar]);

  return (
    <section
      id="book-call"
      ref={sectionRef}
      className="flex w-screen flex-shrink-0 flex-col items-center p-6 pb-32 md:min-w-[1304px] md:p-10 md:pb-32"
    >
      <div className="flex w-full max-w-7xl flex-1 flex-col md:h-full">
        <div className="grid h-full flex-1 grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left Column */}
          <div className="flex w-full flex-1 flex-col justify-between md:h-[640px]">
            <div className="flex flex-col space-y-10">
              <div className="space-y-10">
                <h2
                  ref={headingRef}
                  className="heading-2 flex flex-col text-gray-300"
                  dangerouslySetInnerHTML={{
                    __html: content.bookCall.heading,
                  }}
                />
                <div
                  ref={descriptionRef}
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: content.bookCall.description,
                  }}
                ></div>
              </div>
            </div>
            {/* Testimonial Card */}
            <Testimonial
              author={testimonial.author}
              role={testimonial.role}
              quote={testimonial.quote}
              image="/assets/testimonials/maas.jpg"
              className="hidden md:block"
              size="sm"
            />
          </div>
          {/* Right Column: Tabbed Interface */}
          <div className="flex w-full flex-1 flex-col justify-end md:h-[640px]">
            <div
              className={`mt-auto w-full max-w-full overflow-hidden rounded-3xl p-4 text-gray-100 transition-colors duration-300 sm:w-[480px] md:p-6 ${
                selectedTab === "book-call" ? "bg-[#171717]" : "bg-gray-900"
              }`}
              style={{ height: "100%" }}
            >
              <div className="flex h-full flex-col space-y-6 rounded-3xl p-0 text-gray-100">
                {/* Tab content container */}
                <div className="relative w-full flex-1 overflow-auto">
                  {selectedTab === "book-call" && (
                    <div className="inset-0 flex h-full flex-col justify-between bg-gray-900 p-0">
                      {shouldLoadCalendar ? (
                        <Calendar namespace="intro" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-black/20 p-6 text-center text-sm text-gray-300">
                          <p className="max-w-sm text-base font-medium text-gray-200">
                            Preparing live availability…
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookCallSection;
