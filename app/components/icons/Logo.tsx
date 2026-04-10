import type * as React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const Logo = ({ color = "#FF4502", ...props }: LogoProps) => (
  <svg
    width={43}
    height={17}
    viewBox="0 0 43 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <path
      d="M21.3333 8.63757C21.3333 13.0562 17.752 16.6376 13.3333 16.6376H8C3.58222 16.6376 0 13.0562 0 8.63757C0 4.21891 3.58222 0.637573 8 0.637573H13.3333C17.752 0.637573 21.3333 4.2198 21.3333 8.63757Z"
      fill={color}
    />
    <path
      d="M42.6663 4.63757C42.6663 6.84646 40.8752 8.63757 38.6663 8.63757H29.333C24.9152 8.63757 21.333 5.05624 21.333 0.637573H38.6663C40.8752 0.637573 42.6663 2.42868 42.6663 4.63757Z"
      fill={color}
    />
    <path
      d="M34.6663 12.6376C34.6663 14.8465 32.8752 16.6376 30.6663 16.6376H21.333C21.333 12.2198 24.9152 8.63757 29.333 8.63757H30.6663C31.7641 8.63757 32.757 9.07935 33.4806 9.79491C34.2121 10.5202 34.6655 11.5256 34.6655 12.6367L34.6663 12.6376Z"
      fill={color}
    />
  </svg>
);

export default Logo;
