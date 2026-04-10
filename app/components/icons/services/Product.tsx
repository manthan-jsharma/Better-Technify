import type React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ServiceIcon1 = ({
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
      d="M32.9893 0V32V64C33.139 46.3951 47.3832 32.1485 64.9881 31.9988C47.3832 31.8491 33.139 17.6049 32.9893 0Z"
      fill={color}
    />
    <path
      d="M0.989258 0V64C1.13898 46.3951 15.3832 32.1485 32.9881 31.9988C15.3832 31.8491 1.13898 17.6049 0.989258 0Z"
      fill={color}
    />
  </svg>
);

export default ServiceIcon1;
