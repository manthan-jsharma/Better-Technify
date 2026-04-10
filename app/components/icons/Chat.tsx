import type React from "react";

interface ChatProps {
  fill?: string;
  className?: string;
  size?: number;
}

const Chat: React.FC<ChatProps> = ({ fill = "#fff", className, size = 20 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 12C4 7.58172 7.58172 4 12 4V4C16.4183 4 20 7.58172 20 12V12C20 16.4183 16.4183 20 12 20H4V12Z"
        fill={fill}
      />
    </svg>
  );
};

export default Chat;
