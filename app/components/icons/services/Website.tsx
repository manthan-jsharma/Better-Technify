import type React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ServiceIcon3 = ({
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
      d="M31.9995 4.00293C47.4015 4.13546 59.8601 16.5941 59.9927 31.9961L59.9956 32V4H31.9956L31.9995 4.00293Z"
      fill={color}
    />
    <path
      d="M3.99854 31.9961C4.13106 16.5941 16.5897 4.13546 31.9917 4.00293L31.9956 4H3.99561V32L3.99854 31.9961Z"
      fill={color}
    />
    <path
      d="M31.9917 59.9971C16.5897 59.8645 4.13106 47.4059 3.99854 32.0039L3.99561 32V60H31.9956L31.9917 59.9971Z"
      fill={color}
    />
    <path
      d="M59.9927 32.0039C59.8601 47.4059 47.4015 59.8645 31.9995 59.9971L31.9956 60H59.9956V32L59.9927 32.0039Z"
      fill={color}
    />
  </svg>
);

export default ServiceIcon3;
