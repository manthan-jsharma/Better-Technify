import type React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ServiceIcon2 = ({
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
      d="M31.9925 64C31.8427 46.3951 17.5985 32.1509 -0.00634766 32.0012C17.5985 31.8515 31.8427 17.6049 31.9925 0C32.1422 17.6049 46.3864 31.8515 63.9913 32.0012C46.3864 32.1509 32.1422 46.3951 31.9925 64Z"
      fill={color}
    />
  </svg>
);

export default ServiceIcon2;
