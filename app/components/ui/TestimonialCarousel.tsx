"use client";

import useEmblaCarousel from "embla-carousel-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Testimonial from "./Testimonial";

export type TestimonialColumn = {
  quote: string;
  author: string;
  role?: string;
  date?: string;
  image?: string;
  profileUrl?: string;
};

interface TestimonialsCarouselProps {
  testimonials: TestimonialColumn[];
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: true,
    containScroll: "keepSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const hasUserInteracted = useRef(false);

  // Update selected index on select event
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
  }, [emblaApi]);

  // Initialize scroll snaps and bind select event
  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Scroll to slide on dot click
  const scrollTo = useCallback(
    (index: number) => {
      hasUserInteracted.current = true;
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  // Track swipe interactions
  useEffect(() => {
    if (!emblaApi) return;
    const onPointerDown = () => {
      hasUserInteracted.current = true;
    };
    emblaApi.on("pointerDown", onPointerDown);
    return () => {
      emblaApi.off("pointerDown", onPointerDown);
    };
  }, [emblaApi]);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="w-full px-6" ref={emblaRef}>
        <div className="flex touch-pan-x">
          {testimonials.map((testimonial, idx) => (
            <div
              className="mr-2 w-full min-w-0 flex-shrink-0"
              key={testimonial.author + idx}
            >
              <Testimonial
                className={`h-full ${
                  idx === selectedIndex
                    ? "card-shadow transition-shadow duration-300"
                    : ""
                }`}
                {...testimonial}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Dot navigation */}
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            className={`group flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 ${
              idx === selectedIndex ? "bg-gray-100" : "bg-transparent"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            aria-pressed={idx === selectedIndex}
            onClick={() => scrollTo(idx)}
            type="button"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                idx === selectedIndex
                  ? "h-2 w-4 bg-gray-600"
                  : "h-1.5 w-1.5 bg-gray-300 group-hover:bg-gray-400"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
