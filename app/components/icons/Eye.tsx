import type * as React from "react";

interface EyeProps extends React.SVGProps<SVGSVGElement> {
  innerEyeOffset?: { x: number; y: number };
}

const Eye: React.FC<EyeProps> = ({
  innerEyeOffset = { x: 0, y: 0 },
  ...props
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.0002 4.44336C11.6262 4.44343 13.2159 4.94561 14.5672 5.88542C15.9186 6.82528 16.9713 8.16123 17.5913 9.72327C17.6547 9.90127 17.6547 10.0971 17.5913 10.2751C16.9713 11.8371 15.9186 13.1731 14.5672 14.1129C13.2159 15.0528 11.6262 15.5549 10.0002 15.555C8.37399 15.555 6.78373 15.0529 5.43228 14.1129C4.08095 13.1731 3.02899 11.8371 2.409 10.2751C2.34544 10.0969 2.34544 9.90143 2.409 9.72327C3.02899 8.16124 4.08095 6.82528 5.43228 5.88542C6.78373 4.94553 8.37399 4.44336 10.0002 4.44336Z"
      fill="#1D1F2A"
    />
    <circle
      cx={10 + innerEyeOffset.x}
      cy={10 + innerEyeOffset.y}
      r={2.5}
      fill="white"
      style={{ transition: "cx 0.11s, cy 0.11s" }}
    />
  </svg>
);

export default Eye;
