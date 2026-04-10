"use client";

import Image from "next/image";
import type React from "react";

export interface TestimonialProps {
  author: string;
  role?: string;
  quote: string;
  avatarColor?: string; // fallback color for avatar circle
  className?: string;
  image?: string; // path to avatar image
  size?: "sm" | "md"; // controls quote text size
}

const Testimonial: React.FC<TestimonialProps> = ({
  author,
  role,
  quote,
  avatarColor = "#D1D5DB",
  className = "",
  image,
  size = "md",
}) => {
  return (
    <div
      className={`border-gradient-inner flex max-w-full flex-col justify-between space-y-4 rounded-3xl bg-gradient-to-b from-[#FAFAFA] to-[#F4F4F5] p-6 md:w-[480px] md:max-w-[480px] md:space-y-8 md:p-8 ${className}`}
    >
      <div
        className={`space-y-4 text-gray-600 ${
          size === "sm" ? "text-sm" : "text-base"
        }`}
      >
        {quote}
      </div>
      <div className="flex items-center space-x-3 pt-2">
        {image ? (
          <Image
            src={image}
            alt={author}
            width={size === "sm" ? 40 : 48}
            height={size === "sm" ? 40 : 48}
            className="rounded-full border border-gray-200 object-cover"
            unoptimized
          />
        ) : (
          <span
            className={`inline-flex items-center justify-center rounded-full font-semibold ${
              size === "sm" ? "h-10 w-10 text-base" : "h-12 w-12 text-lg"
            }`}
            style={{ backgroundColor: avatarColor }}
          >
            {author.charAt(0)}
          </span>
        )}
        <div className="flex flex-col">
          <span
            className={`font-semibold text-gray-800 ${
              size === "sm" ? "text-sm" : ""
            }`}
          >
            {author}
          </span>
          {role && <span className="text-sm text-gray-500">{role}</span>}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
