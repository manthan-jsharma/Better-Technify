"use client";

import React from "react";
import Brand from "@/app/components/icons/services/Brand";
import Development from "@/app/components/icons/services/Development";
import Product from "@/app/components/icons/services/Product";
import Website from "@/app/components/icons/services/Website";
import content from "@/app/data/content.json";

const ServicesSection = () => {
  const sectionRef = React.useRef<HTMLElement>(null);

  // No animations - all elements are visible immediately

  return (
    <section ref={sectionRef} id="services" className="p-6 md:p-10 md:pb-32">
      <div className="mx-auto flex flex-col gap-10 md:gap-24">
        <h2
          className="heading-2 md:flex md:flex-col text-gray-300"
          dangerouslySetInnerHTML={{ __html: content.services.heading }}
        />
        <div className="flex flex-col gap-10 md:flex-row md:gap-32">
          <div className="w-full text-gray-600 md:mt-20 md:min-w-sm">
            <div
              dangerouslySetInnerHTML={{
                __html: content.services.description,
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-10 md:flex-row md:gap-16">
            {content.services.columns.map(
              (col: { title: string; items: string[] }, i: number) => (
                <div
                  key={col.title}
                  className="flex w-full flex-col items-start gap-4 md:min-w-[184px] md:gap-6"
                >
                  {i === 0 && <Product className="h-10 w-10 md:h-12 md:w-12" />}
                  {i === 1 && <Brand className="h-10 w-10 md:h-12 md:w-12" />}
                  {i === 2 && <Website className="h-10 w-10 md:h-12 md:w-12" />}
                  {i === 3 && (
                    <Development className="h-10 w-10 md:h-12 md:w-12" />
                  )}
                  <p className="w-full text-2xl leading-tight font-semibold tracking-[-0.01em] text-gray-800">
                    {col.title}
                  </p>
                  <ul className="flex w-full flex-col gap-2 md:gap-3">
                    {col.items.map((item: string, idx: number) => (
                      <li key={idx} className="text-gray-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
