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
      className="flex w-screen p-6 md:h-full md:min-w-[1304px] md:flex-shrink-0 md:p-10 md:pb-32"
      onMouseEnter={() => setIsPointerActive(true)}
      onMouseLeave={() => setIsPointerActive(false)}
    >
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
                  className="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[1.25rem] bg-gray-50 md:aspect-square md:h-full md:rounded-3xl"
                  onClick={() => setIsWorkModalOpen(true)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onMouseMove={(e) => {
                    setPointerPos({ x: e.clientX, y: e.clientY });
                    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
                  }}
                >
                  {project.image ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1920px"
                        className={`high-quality-image ${
                          idx === 2 ? "object-cover" : "object-contain"
                        } !relative transition-transform duration-300 group-hover:scale-105 md:absolute`}
                        quality={75}
                        priority={true}
                        placeholder={project.blurDataURL ? "blur" : "empty"}
                        blurDataURL={project.blurDataURL || undefined}
                      />
                    </div>
                  ) : (
                    <div className="h-full w-full bg-gray-300"></div>
                  )}
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
      />
    </section>
  );
};

export default WorkSection;
