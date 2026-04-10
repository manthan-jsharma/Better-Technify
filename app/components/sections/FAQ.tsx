"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef, useState } from "react";
import Telegram from "@/app/components/icons/Telegram";
import Button from "@/app/components/ui/Button";
import content from "@/app/data/content.json";

gsap.registerPlugin(ScrollTrigger);

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const iconRef = React.useRef<HTMLDivElement>(null);
  const hasMounted = React.useRef(false);

  React.useLayoutEffect(() => {
    if (!wrapperRef.current || !contentRef.current || !iconRef.current) return;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const icon = iconRef.current;
    const iconVerticalLine = icon.querySelector(
      "span:nth-child(2)"
    ) as HTMLElement;

    // On first mount, set height directly and skip animation
    if (!hasMounted.current) {
      if (!isOpen) {
        wrapper.style.height = "0px";
        if (iconVerticalLine) {
          iconVerticalLine.style.transform = "rotate(0deg)";
        }
      } else {
        wrapper.style.height = `${content.scrollHeight}px`;
        if (iconVerticalLine) {
          iconVerticalLine.style.transform = "rotate(90deg)";
        }
      }
      hasMounted.current = true;
      return;
    }

    // On subsequent updates, always animate from current computed height to target
    const startHeight = wrapper.getBoundingClientRect().height;
    let endHeight: number;
    if (isOpen) {
      // Measure expanded height
      wrapper.style.height = "auto";
      endHeight = content.scrollHeight;
      wrapper.style.height = `${startHeight}px`;
    } else {
      endHeight = 0;
    }

    const tl = gsap.timeline({ overwrite: true });

    // Animate the height of the content wrapper
    tl.to(
      wrapper,
      {
        height: endHeight,
        duration: 0.32,
        ease: "power2.out",
        onComplete: () => {
          // Remove inline height when open, keep 0px when closed
          if (isOpen) {
            wrapper.style.height = "";
          } else {
            wrapper.style.height = "0px";
          }
        },
      },
      0
    );

    // Animate the color change with GSAP
    tl.to(
      icon,
      {
        color: isOpen ? "#1F2937" : "#9D9FAE", // gray-800 when open, gray-400 when closed
        duration: 0.15, // Match the CSS transition duration of 150ms
        ease: "power2.out",
      },
      0
    );

    // Note: We're not animating the rotation with GSAP anymore
    // because we're using CSS transitions for smoother animation

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  const handleClick = () => {
    onClick();
  };

  const contentId = `faq-content-${question.replace(/\s+/g, "-")}`;

  return (
    <>
      <dt className="w-full md:w-2xl">
        <button
          className={`flex w-full cursor-pointer items-center justify-between font-semibold transition`}
          onClick={handleClick}
          aria-expanded={isOpen}
          aria-controls={contentId}
          type="button"
        >
          <span
            className={`pb-3 transition-colors duration-150 ${
              isOpen ? "text-gray-800" : "text-gray-400"
            }`}
          >
            {question}
          </span>
          <div
            ref={iconRef}
            className={`relative flex items-center justify-center ${
              isOpen ? "text-gray-800" : "text-gray-400"
            }`}
            style={{ width: "16px", height: "16px" }}
            aria-hidden="true"
          >
            {/* 14px icon centered in 16px box */}
            {/* Plus/X icon using a rotating wrapper for perfect symmetry */}
            <span
              className="absolute top-1/2 left-1/2 flex h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform duration-200"
              style={{
                transform: isOpen
                  ? "translate(-50%, -50%) rotate(45deg)"
                  : "translate(-50%, -50%) rotate(0deg)",
              }}
            >
              <span
                className="absolute rounded-full bg-current"
                style={{ height: "1.5px", width: "14px" }}
              ></span>
              <span
                className="absolute rounded-full bg-current"
                style={{ width: "1.5px", height: "14px" }}
              ></span>
            </span>
          </div>
        </button>
      </dt>
      <dd className="w-full md:w-2xl" id={contentId}>
        <div ref={wrapperRef} className="overflow-hidden" aria-hidden={!isOpen}>
          <div ref={contentRef} className="pb-3 text-gray-600">
            {answer}
          </div>
        </div>
      </dd>
    </>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const faqListRef = useRef<HTMLDListElement>(null);
  const needMoreRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Simultaneous open/close: set openIndex immediately
  const toggleFAQ = (index: number) => {
    if (!hasInteracted) setHasInteracted(true);
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  // No animations needed

  return (
    <section ref={sectionRef} id="faq" className="p-6 md:p-10 md:pb-32">
      <div className="flex h-full flex-col gap-8 md:flex-row md:gap-20">
        {/* Left: Heading and contact (stacked on mobile, column on desktop) */}
        <header className="flex w-full flex-col self-center md:h-[556px] md:w-[440px]">
          <h2
            ref={headingRef}
            className="heading-2-small w-[440px] whitespace-pre-line text-gray-300"
            dangerouslySetInnerHTML={{ __html: content.faq.heading }}
          />
          <div ref={contactRef} className="mt-8 flex flex-col gap-6">
            <p
              ref={needMoreRef}
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: content.faq.needMore }}
            />
            <div ref={buttonsRef} className="flex gap-2">
              <Button
                variant="secondary"
                icon={<Telegram width={24} height={24} className="ml-2" />}
                label="Chat with us"
                iconRight
                className="!pr-3 !pl-4 text-gray-700"
                onClick={() => {
                  window.open("https://t.me/jessevermeulen", "_blank");
                }}
              />
            </div>
          </div>
        </header>
        {/* FAQ: full width on mobile, right column on desktop */}
        <div className="flex w-full items-center">
          <dl ref={faqListRef} className="flex flex-col gap-4">
            {content.faq.items.map(
              (faq: { question: string; answer: string }, index: number) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => toggleFAQ(index)}
                />
              )
            )}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
