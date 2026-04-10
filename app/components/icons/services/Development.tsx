import type React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const Development = ({
  width = 64,
  height = 64,
  color = "#FF4502",
  ...props
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M38.9951 59.9961C19.7427 59.8304 4.16957 44.2573 4.00391 25.0049L4 25V60H39L38.9951 59.9961Z"
      fill={color}
    />
    <path
      d="M25.0049 4.00391C44.2573 4.16957 59.8304 19.7427 59.9961 38.9951L60 39V4H25L25.0049 4.00391Z"
      fill={color}
    />
  </svg>
);

export default Development;
