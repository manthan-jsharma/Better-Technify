"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import content from "@/app/data/content.json";
// Import the centralized projects data
import { projects } from "@/app/data/projects";
import Pointer from "./Pointer";

const WorkModal = dynamic(() => import("@/app/components/modals/WorkModal"), {
  ssr: false,
});

interface WorkSectionProps {
  onBookCall?: () => void;
  isWorkModalOpen: boolean;
  setIsWorkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkSection: React.FC<WorkSectionProps> = ({
  onBookCall,
  isWorkModalOpen,
  setIsWorkModalOpen,
}) => {
  // Pointer state for global overlay
  const [pointerPos, setPointerPos] = React.useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const lastMousePosRef = React.useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Only track mouse position when mouse is inside #work section
  const [isPointerActive, setIsPointerActive] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isPointerActive) return;
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      setPointerPos({ x: e.clientX, y: e.clientY });
    };
    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isPointerActive]);

  // Update pointer position from modal
  // (handleModalMouseMove removed, no longer needed)

  // Helper to close modal
  const handleModalClose = () => {
    setIsWorkModalOpen(false);
    // PointerPos already up-to-date from last mousemove
  };

  // Define which project IDs to feature in the grid
  const featuredProjectIds = [
    "impala-2",
    "poap-1",
    "evm-1",
    "explorations-1",
    // Change these to any project IDs you want to feature
  ];
  const featuredProjects: (typeof projects[0] | null)[] =
    featuredProjectIds.map((id) => projects.find((p) => p.id === id) || null);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative flex w-screen p-6 md:h-full md:min-w-[1304px] md:flex-shrink-0 md:p-10 md:pb-32"
      onMouseEnter={() => setIsPointerActive(true)}
      onMouseLeave={() => setIsPointerActive(false)}
    >
      {/* Hero mask SVG accent — vertically centred in the section */}
      <div className="absolute top-1/2 left-10 z-10 -translate-y-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 96"
          aria-hidden="true"
          style={{ height: "144px", width: "384px" }}
        >
          <path style={{ fill: "#FF4502" }} d="M128 48C128 21.4903 106.51 0 80.0001 0H48C21.4904 0 0 21.4903 0 48C0 74.5097 21.4904 96 48 96H80.0001C106.51 96 128 74.5097 128 48Z"/>
          <path style={{ fill: "#FF4502" }} d="M128 0H232C245.255 0 256 10.7452 256 24C256 37.2548 245.255 48 232 48H176C149.49 48 128 26.5097 128 0Z"/>
          <path style={{ fill: "#FF4502" }} d="M192 96C205.255 96 216 85.2548 216 72C216 58.7452 205.255 48 192 48H176C149.49 48 128 69.4903 128 96H192Z"/>
        </svg>
      </div>

      <div className="flex h-full w-full flex-col gap-10 md:flex-row md:gap-40">
        {/* Left column: header/title */}
        <div className="flex flex-col justify-end md:px-8">
          <h2
            className="heading-2 flex flex-col whitespace-nowrap text-gray-300 md:self-end"
            dangerouslySetInnerHTML={{ __html: content.work.heading }}
          />
        </div>
        {/* Right column: 2x2 grid of images (first 4 projects) */}
        <div className="flex w-full items-center">
          <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2">
            {featuredProjects.map((project, idx) =>
              project ? (
                <div
                  key={project.id}
                  className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-[1.25rem] md:h-full md:rounded-3xl"
                  onClick={() => setIsWorkModalOpen(true)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onMouseMove={(e) => {
                    setPointerPos({ x: e.clientX, y: e.clientY });
                    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
                  }}
                >
                  {/* Image area */}
                  <div
                    className="relative min-h-[160px] flex-1"
                    style={
                      project.placeholderBackground
                        ? { background: project.placeholderBackground }
                        : { background: "#f3f4f6" }
                    }
                  >
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1920px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        quality={80}
                        priority={idx < 2}
                        placeholder={project.blurDataURL ? "blur" : "empty"}
                        blurDataURL={project.blurDataURL || undefined}
                      />
                    )}
                  </div>

                  {/* Info bar — in normal flow, always visible */}
                  <div className="flex shrink-0 items-center justify-between gap-2 bg-gray-900 px-4 py-3">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="truncate text-sm font-semibold text-white">
                        {project.title}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.categories.map((cat) => (
                          <span key={cat} className="text-xs text-gray-400">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#FF4502] hover:underline"
                      >
                        View live
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 9L9 1M9 1H3M9 1V7"
                            stroke="#FF4502"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  key={`placeholder-${idx}`}
                  className="h-full w-full rounded-[1.25rem] bg-gray-200 md:rounded-3xl"
                ></div>
              )
            )}
          </div>
        </div>
      </div>
      {/* Global pointer overlay */}
      <Pointer
        visible={isPointerActive && hoveredIndex !== null && !isWorkModalOpen}
        x={pointerPos.x}
        y={pointerPos.y}
      />
      {/* Full-screen work modal */}
      <WorkModal
        isOpen={isWorkModalOpen}
        onClose={handleModalClose}
        onBookCall={onBookCall}
        featuredProjects={
          featuredProjects.filter(Boolean) as typeof projects[0][]
        }
      />
    </section>
  );
};

export default WorkSection;
