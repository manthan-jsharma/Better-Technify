import type React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

const ProcessIcon2 = ({ width = 64, height = 64, ...props }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 65 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M32.4941 32H64.4941L64.4912 31.9961C64.34 14.3934 50.1007 0.154094 32.498 0.00292969L32.4941 0V32Z"
      fill="#FF4502"
    />
    <path
      d="M32.4941 64V63.9971V32H0.49707H0.494141L0.49707 32.0039C0.648234 49.6066 14.8875 63.8459 32.4902 63.9971L32.4941 64Z"
      fill="#FF4502"
    />
    <path
      d="M64.4902 32.0029C46.8875 32.1541 32.6482 46.3934 32.4971 63.9961L32.4963 63.9971H64.4941V32L64.4902 32.0029Z"
      fill="#FF4502"
    />
    <path
      d="M0.498047 31.9971C18.1007 31.8459 32.34 17.6066 32.4912 0.00390625L32.4941 0L0.498047 0.00393254L0.49707 31.9978L0.498047 31.9971Z"
      fill="#FF4502"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.494141 32H0.49707L0.49707 31.9978L0.494141 32Z"
      fill="#FF4502"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.4941 63.9971V64L32.4963 63.9971H32.4941Z"
      fill="#FF4502"
    />
  </svg>
);

export default ProcessIcon2;
