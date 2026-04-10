"use client";
import type React from "react";
import { useEffect, useState } from "react";

export default function HydrationFade({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return (
    <div
      className={
        (hydrated ? "opacity-100" : "opacity-0") +
        " transition-opacity duration-300 min-h-screen"
      }
    >
      {children}
    </div>
  );
}
