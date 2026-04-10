"use client";

import posthog from "posthog-js";
import Checkmark from "@/app/components/icons/Checkmark";
import Logo from "@/app/components/icons/Logo";
import Button from "@/app/components/ui/Button";
import content from "@/app/data/content.json";
import Testimonial from "../ui/Testimonial";

const PlansSection = () => {
  const plansCopy = content.plans;
  const testimonialCard = content.testimonials.columns[6];
  return (
    <section
      id="plans"
      className="flex w-screen flex-shrink-0 flex-col items-center p-6 md:min-w-[1304px] md:p-10 md:pb-32"
    >
      <div className="flex h-full w-full max-w-fit flex-1 flex-col justify-center gap-8 md:gap-16">
        {/* Heading, description, testimonial in horizontal row */}
        <div className="flex w-full flex-row">
          <div className="flex w-full flex-col gap-10 md:px-8">
            <h2
              className="heading-2-small text-gray-300"
              dangerouslySetInnerHTML={{ __html: content.plans.heading }}
            />
            <p
              className="text-gray-600 md:max-w-[384px]"
              dangerouslySetInnerHTML={{ __html: content.plans.description }}
            />
          </div>
          <div className="hidden w-full items-center justify-center px-8 md:flex">
            <Testimonial
              key={testimonialCard.author}
              author={testimonialCard.author}
              role={testimonialCard.role}
              quote={testimonialCard.quote}
              image={testimonialCard.image}
              size="sm"
            />
          </div>
        </div>
        {/* Plan cards */}
        <div className="flex items-center md:flex-col md:gap-8">
          <div className="flex flex-col items-end gap-4 md:flex-row md:gap-6">
            {(
              plansCopy.items as Array<{
                heading: string;
                description: string;
                price: string;
                features?: string[];
              }>
            ).map((plan, idx) => {
              // Use the price property from the plan
              const price = plan.price;
              const isHighlighted = idx === 0; // Marathon is highlighted
              const isLight = !isHighlighted;
              return (
                <div
                  key={plan.heading}
                  className={`relative flex w-full flex-col justify-between gap-6 ${
                    isHighlighted ? "md:gap-14" : ""
                  } overflow-hidden rounded-[20px] p-6 transition-shadow md:w-[600px] md:min-w-[400px] md:rounded-3xl md:p-8 ${
                    isHighlighted
                      ? "border-gradient-inner card-shadow bg-gradient-to-b from-[#FF4F1A] to-[#FF3C00]"
                      : "border-gradient-inner bg-gradient-to-b from-[#FAFAFA] to-[#F4F4F5]"
                  }`}
                  style={
                    isHighlighted
                      ? {
                          // Custom border gradient for the highlighted card (orange)
                          ["--border-gradient-from" as string]:
                            "hsla(14, 100%, 80%, 1)",
                          ["--border-gradient-to" as string]:
                            "hsla(14, 100%, 90%, 1)",
                        }
                      : {}
                  }
                >
                  <div className="relative flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-1 md:gap-1.5">
                        <h3
                          className={`text-2xl font-bold tracking-[-0.02em] md:text-3xl ${
                            isHighlighted ? "text-white" : "text-gray-700"
                          }`}
                          dangerouslySetInnerHTML={{ __html: plan.heading }}
                        />
                        <Logo
                          width={60}
                          height={20}
                          className={`shrink-0 ${
                            isLight ? "opacity-20" : "opacity-40"
                          }`.trim()}
                          color={isHighlighted ? "#fff" : "#191B24"}
                        />
                      </div>
                      <div
                        className={`font-medium ${
                          isHighlighted ? "text-white" : "text-gray-600"
                        }`}
                        dangerouslySetInnerHTML={{ __html: plan.description }}
                      />
                    </div>
                    {plan.features && plan.features.length > 0 && (
                      <ul className="space-y-1">
                        {(plan.features as string[]).map(
                          (feature: string, i: number) => (
                            <li key={i} className="flex gap-3">
                              <span className="flex h-6 items-center">
                                <Checkmark
                                  color={isHighlighted ? "#fff" : "#A3A3A3"}
                                />
                              </span>
                              <span
                                className={` ${
                                  isHighlighted ? "text-white" : "text-gray-600"
                                }`}
                              >
                                {feature}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </div>
                  <div
                    className={`flex w-full items-center justify-between ${
                      isLight ? "items-end" : ""
                    }`}
                  >
                    <p
                      className={`text-2xl font-semibold flex flex-col gap-0.5 ${
                        isHighlighted ? "text-white" : "text-gray-700"
                      }`}
                      dangerouslySetInnerHTML={{ __html: price }}
                    />
                    {isHighlighted ? (
                      <Button
                        variant="secondary"
                        className="bg-white !text-[var(--color-brand)] before:opacity-0"
                        label="Book Call"
                        onClick={() => {
                          posthog.capture("book_call_clicked", {
                            source: "plans_section",
                            plan_name: plan.heading,
                            plan_price: plan.price,
                          });
                          if (typeof window.openBookCallModal === "function") {
                            window.openBookCallModal("book-call");
                          }
                        }}
                      />
                    ) : (
                      <Button
                        variant="primary"
                        className="!bg-gray-700"
                        label="Book Call"
                        onClick={() => {
                          posthog.capture("book_call_clicked", {
                            source: "plans_section",
                            plan_name: plan.heading,
                            plan_price: plan.price,
                          });
                          if (typeof window.openBookCallModal === "function") {
                            window.openBookCallModal("book-call");
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Crypto payments accepted label with icons */}
          {/* <div className="flex items-center gap-2">
            <span className="flex"> */}
          {/* USDC and Tether crypto icons */}
          {/* <USDC className="relative z-10 rounded-full ring-1 ring-white" />
              <Tether className="relative z-0 -ml-[5px]" />
            </span>
            <span className="text-sm font-medium text-gray-500">
              {t("plans.cryptoPaymentsAccepted")}
            </span>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
