"use client";

import React from "react";

type CalModule = typeof import("@calcom/embed-react");

declare global {
  interface Window {
    __calEmbedLoaded?: boolean;
  }
}

export default function Calendar({
  namespace = "intro",
}: {
  namespace?: string;
}) {
  const [CalComponent, setCalComponent] = React.useState<
    CalModule["default"] | null
  >(null);
  const getCalApiRef = React.useRef<CalModule["getCalApi"] | null>(null);
  const configuredNamespaces = React.useRef<Record<string, boolean>>({});

  React.useEffect(() => {
    let cancelled = false;
    React.startTransition(() => {
      import("@calcom/embed-react")
        .then((mod) => {
          if (cancelled) return;
          setCalComponent(() => mod.default);
          getCalApiRef.current = mod.getCalApi;
        })
        .catch(() => {
          setCalComponent(null);
          getCalApiRef.current = null;
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!getCalApiRef.current) return;
    let active = true;
    (async () => {
      try {
        const cal = await getCalApiRef.current?.({ namespace });
        if (!active || !cal) return;
        if (!configuredNamespaces.current[namespace]) {
          configuredNamespaces.current[namespace] = true;
          cal("ui", {
            cssVarsPerTheme: {
              light: { "cal-brand": "#1A1A1A" },
              dark: { "cal-brand": "#ffffff" },
            },
            hideEventTypeDetails: true,
            layout: "month_view",
          });
          if (typeof window !== "undefined") {
            window.__calEmbedLoaded = true;
            window.dispatchEvent(new Event("calEmbedReady"));
          }
        }
      } catch (error) {
        // Swallow configuration errors to avoid noisy console output in production
        void error;
      }
    })();
    return () => {
      active = false;
    };
  }, [namespace]);

  if (!CalComponent) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: 400,
          background: "#171717",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        background: "#171717",
      }}
    >
      <CalComponent
        namespace={namespace}
        calLink="outpace/intro-modal"
        style={{
          width: "100%",
          height: "100%",
          minHeight: 400,
          overflow: "auto",
        }}
        config={{ layout: "month_view", theme: "dark" }}
      />
    </div>
  );
}
