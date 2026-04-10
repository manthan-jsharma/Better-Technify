"use client";

import React from "react";
import content from "@/app/data/content.json";

// type ProcessCopy = {
//   heading: string;
//   columns: ProcessColumn[];
// };

import Conversion from "@/app/components/icons/process/Conversion";
import Senior from "@/app/components/icons/process/Senior";
import Team from "@/app/components/icons/process/Team";

const ProcessSection = () => {
  return (
    <section id="process" className="p-6 md:p-10 md:pb-32">
      <div className="mx-auto flex flex-col gap-10 md:gap-24">
        <div
          className="heading-2 flex w-max flex-col whitespace-pre-line text-gray-300"
          dangerouslySetInnerHTML={{ __html: content.process.heading }}
        />
        <div className="flex flex-col gap-10 md:flex-row md:gap-28">
          {content.process.columns.map(
            (col: { title: string; body: string[] }, i: number) => (
              <div
                key={col.title}
                className="flex w-full flex-col gap-6 md:w-sm"
              >
                {/* Custom SVG icon above title, one per column */}
                {i === 0 && <Senior className="h-10 w-10 md:h-12 md:w-12" />}
                {i === 1 && (
                  <Conversion className="h-10 w-10 md:h-12 md:w-12" />
                )}
                {i === 2 && <Team className="h-10 w-10 md:h-12 md:w-12" />}
                <div className="flex flex-col gap-6">
                  <div
                    className="text-xl leading-tight font-semibold tracking-[-0.01em] whitespace-pre-line text-gray-800"
                    dangerouslySetInnerHTML={{ __html: col.title }}
                  />
                  <div className="flex flex-col gap-6">
                    {col.body.map((paragraph: string, idx: number) => (
                      <p
                        key={idx}
                        className="whitespace-pre-line text-gray-600"
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                      />
                    ))}
                    {i === 2 && <EmojiPills />}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

// Minimal emoji counter pills for Slack jokes
const EmojiPills = () => {
  const [laugh, setLaugh] = React.useState(4);
  const [fire, setFire] = React.useState(3);
  const [laughActive, setLaughActive] = React.useState(false);
  const [fireActive, setFireActive] = React.useState(false);

  const handleLaugh = () => {
    if (!laughActive) {
      setLaugh(laugh + 1);
      setLaughActive(true);
    } else {
      setLaugh(laugh - 1);
      setLaughActive(false);
    }
  };
  const handleFire = () => {
    if (!fireActive) {
      setFire(fire + 1);
      setFireActive(true);
    } else {
      setFire(fire - 1);
      setFireActive(false);
    }
  };

  return (
    <div className="flex gap-1">
      <button
        className={`flex cursor-pointer items-center rounded-full py-[1px] pr-1 pl-1.5 text-sm font-semibold text-white focus:outline-none ${
          laughActive ? "bg-[#004D76]" : "bg-[#282A2E]"
        }`}
        onClick={handleLaugh}
        type="button"
      >
        <span role="img" aria-label="laugh" className="text-base">
          😆
        </span>{" "}
        <span className="inline-block w-[16px] text-center">{laugh}</span>
      </button>
      <button
        className={`flex cursor-pointer items-center rounded-full py-[1px] pr-1 pl-1.5 text-sm font-semibold text-white focus:outline-none ${
          fireActive ? "bg-[#004D76]" : "bg-[#282A2E]"
        }`}
        onClick={handleFire}
        type="button"
      >
        <span role="img" aria-label="fire" className="text-base">
          🔥
        </span>{" "}
        <span className="inline-block w-[16px] text-center">{fire}</span>
      </button>
    </div>
  );
};

export default ProcessSection;
