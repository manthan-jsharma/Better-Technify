const ServicesIcon = ({ fill }: { fill: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 8C11 9.657 9.657 11 8 11H6C4.34333 11 3 9.657 3 8C3 6.343 4.34333 5 6 5H8C9.657 5 11 6.34333 11 8Z"
      fill={fill || "#D3D4D9"}
    />
    <path
      d="M21 8C21 9.657 19.657 11 18 11H16C14.3433 11 13 9.657 13 8C13 6.343 14.3433 5 16 5H18C19.657 5 21 6.34333 21 8Z"
      fill={fill || "#D3D4D9"}
    />
    <path
      d="M11 16C11 17.657 9.657 19 8 19H6C4.34333 19 3 17.657 3 16C3 14.343 4.34333 13 6 13H8C9.657 13 11 14.3433 11 16Z"
      fill={fill || "#D3D4D9"}
    />
    <path
      d="M21 16C21 17.657 19.657 19 18 19H16C14.3433 19 13 17.657 13 16C13 14.343 14.3433 13 16 13H18C19.657 13 21 14.3433 21 16Z"
      fill={fill || "#D3D4D9"}
    />
  </svg>
);

export default ServicesIcon;
