"use client";

import gsap from "gsap";
import React, { useEffect, useRef } from "react";

// Custom pointer overlay for Work section
const WorkPointer: React.FC<{ visible: boolean; x: number; y: number }> = ({
  visible,
  x,
  y,
}) => {
  const pointerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [pillWidth, setPillWidth] = React.useState(0);

  // Measure pill width on mount and when text changes
  useEffect(() => {
    if (pillRef.current) {
      setPillWidth(pillRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (pointerRef.current) {
      // Center horizontally, offset vertically above pointer
      gsap.to(pointerRef.current, {
        x: x - pillWidth / 2,
        y: y - 36, // 38px above pointer for nice spacing
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.7,
        duration: 0.22,
        ease: "power2.out",
        pointerEvents: "none",
      });
    }
  }, [x, y, visible, pillWidth]);

  // Render in-place (no portal), so it is relative to the Work section
  return (
    <div
      ref={pointerRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        pointerEvents: "none",
        opacity: 0,
        willChange: "transform, opacity",
        background: "rgba(25, 27, 36, 0.4)",
        borderRadius: 48,
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        transition: "background 0.2s cubic-bezier(.4,0,.2,1)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        ref={pillRef}
        style={{
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          padding: "8px 16px",
        }}
      >
        View Work
      </div>
    </div>
  );
};
export default WorkPointer;
