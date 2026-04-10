import type React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

const ProcessIcon3 = ({ width = 64, height = 64, ...props }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M32 32H64V0L63.9961 0.00292969C46.3934 0.154094 32.1541 14.3934 32.0029 31.9961L32 32Z"
      fill="#FF4502"
    />
    <path
      d="M32 32V64H64L63.9971 63.9961C63.8459 46.3934 49.6066 32.1541 32.0039 32.0029L32 32Z"
      fill="#FF4502"
    />
    <path
      d="M32 32H0V64L0.00390625 63.9971C17.6066 63.8459 31.8459 49.6066 31.9971 32.0039L32 32Z"
      fill="#FF4502"
    />
    <path
      d="M0.00292969 0.00390625C0.154093 17.6066 14.3934 31.8459 31.9961 31.9971L32 32V0L0 0L0.00292969 0.00390625Z"
      fill="#FF4502"
    />
  </svg>
);

export default ProcessIcon3;
