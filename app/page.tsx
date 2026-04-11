"use client";

import { useEffect, useState } from "react";
import Modal from "@/app/components/modals/Modal";
import Navigation from "@/app/components/navigation/Navigation";
import WorkNavigation from "@/app/components/navigation/WorkNavigation";
import BookCallSection from "@/app/components/sections/BookCall";
import Breather from "@/app/components/sections/Breather";
import FAQSection from "@/app/components/sections/FAQ";
import HeroSection from "@/app/components/sections/Hero";
import PlansSection from "@/app/components/sections/Plans";
import ProcessSection from "@/app/components/sections/Process";
import ServiceSection from "@/app/components/sections/Services";
import TestimonialsSection from "@/app/components/sections/Testimonials";
import WorkSection from "@/app/components/sections/Work";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"book-call" | "get-quote">(
    "book-call"
  );

  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.matchMedia("(max-width: 767px)").matches;
      document.body.style.overflowX = isMobileView ? "hidden" : "";
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.openBookCallModal = (
      tab: "book-call" | "get-quote" = "book-call"
    ) => {
      setModalTab(tab);
      setIsModalOpen(true);
    };
    return () => {
      window.openBookCallModal = undefined;
    };
  }, []);

  // Show desktop layout for larger screens
  return (
    <div className="relative overflow-x-hidden md:h-[100vh] md:overflow-x-visible">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
      />
      <div className="md:h-full">
        <div
          id="horizontal-scroll"
          className="flex w-auto flex-col flex-nowrap gap-10 md:h-full md:flex-row md:gap-40"
        >
          <HeroSection setIsWorkModalOpen={setIsWorkModalOpen} />
          <Breather
            onBookCall={() => setIsModalOpen(true)}
            isWorkModalOpen={isWorkModalOpen}
            setIsWorkModalOpen={setIsWorkModalOpen}
          />
          <ServiceSection />
          <WorkSection
            onBookCall={() => setIsModalOpen(true)}
            isWorkModalOpen={isWorkModalOpen}
            setIsWorkModalOpen={setIsWorkModalOpen}
          />
          <ProcessSection />
          <TestimonialsSection />
          <PlansSection />
          <FAQSection />
          <BookCallSection />
        </div>
      </div>
      <Navigation onBookCall={() => setIsModalOpen(true)} />
      {/* Show WorkNavigation above everything when WorkModal is open */}
      {isWorkModalOpen && (
        <WorkNavigation onBookCall={() => setIsModalOpen(true)} />
      )}
    </div>
  );
}
