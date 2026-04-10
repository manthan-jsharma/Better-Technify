import type React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

const ProcessIcon1 = ({ width = 64, height = 64, ...props }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 65 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M32.9863 63.9961C32.8352 46.3934 18.5959 32.1541 0.993164 32.0029L0.989258 32V64H32.9893L32.9863 63.9961Z"
      fill="#FF4502"
    />
    <path
      d="M0.993164 31.9971C18.5959 31.8459 32.8352 17.6066 32.9863 0.00390625L32.9893 0H0.989258V32L0.993164 31.9971Z"
      fill="#FF4502"
    />
    <path
      d="M32.9922 0.00390625C33.1434 17.6066 47.3827 31.8459 64.9854 31.9971L64.9893 32V0.00390625H32.9922Z"
      fill="#FF4502"
    />
    <path
      d="M64.9854 32.0029C47.3827 32.1541 33.1434 46.3934 32.9922 63.9961L32.9893 64H64.9893V32L64.9854 32.0029Z"
      fill="#FF4502"
    />
  </svg>
);

export default ProcessIcon1;
