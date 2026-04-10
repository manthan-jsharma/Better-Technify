const TestimonialsIcon = ({ fill }: { fill: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1064_1028)">
      <path
        d="M16 7.5C16 9.157 14.657 10.5 13 10.5H11C9.34333 10.5 8 9.157 8 7.5C8 5.843 9.34333 4.5 11 4.5H13C14.657 4.5 16 5.84333 16 7.5Z"
        fill={fill || "#D3D4D9"}
      />
      <path
        d="M12 31.1667C8.13367 31.1667 5 28.033 5 24.1667L5 19.5C5 15.6344 8.13367 12.5 12 12.5C15.8663 12.5 19 15.6344 19 19.5L19 24.1667C19 28.033 15.8656 31.1667 12 31.1667Z"
        fill={fill || "#D3D4D9"}
      />
    </g>
    <defs>
      <clipPath id="clip0_1064_1028">
        <rect
          width="16"
          height="15"
          fill="white"
          transform="translate(4 4.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default TestimonialsIcon;
