import type * as React from "react";

interface CheckmarkProps {
  color?: string;
  className?: string;
}

const Checkmark: React.FC<CheckmarkProps> = ({
  color = "white",
  className = "h-4 w-4",
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.99935 0.666016C3.94926 0.666016 0.666016 3.94926 0.666016 7.99935C0.666016 12.0494 3.94926 15.3327 7.99935 15.3327C12.0494 15.3327 15.3327 12.0494 15.3327 7.99935C15.3327 3.94926 12.0494 0.666016 7.99935 0.666016ZM11.4708 6.47075C11.7311 6.2104 11.7311 5.78829 11.4708 5.52794C11.2104 5.26759 10.7883 5.26759 10.5279 5.52794L6.99935 9.05654L5.47075 7.52794C5.2104 7.26759 4.78829 7.26759 4.52794 7.52794C4.26759 7.78829 4.26759 8.2104 4.52794 8.47075L6.52794 10.4708C6.78829 10.7311 7.2104 10.7311 7.47075 10.4708L11.4708 6.47075Z"
      fill={color}
    />
  </svg>
);

export default Checkmark;
