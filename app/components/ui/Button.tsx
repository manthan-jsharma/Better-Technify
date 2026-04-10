import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "white";

export type ButtonSize = "md" | "sm";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * If true, applies asymmetric padding for icon buttons: 10px top, 16px right, 10px bottom, 12px left. If false, uses 10px top/bottom and 16px left/right.
   * Defaults to true.
   */
  hasIcon?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  /**
   * If true, places the icon after the label (icon on right). Default is false (icon left).
   */
  iconRight?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className, iconRight = false, ...rest },
    ref
  ) => {
    const variantStyles =
      variant === "primary"
        ? "bg-gray-800 text-white hover:bg-gray-650"
        : variant === "white"
        ? "bg-white text-gray-800 hover:bg-gray-100"
        : "bg-gray-100 text-gray-800 hover:bg-gray-100";

    const hasActualIcon = Boolean(rest.icon);
    let paddingClass = "";
    let sizeClass = "";
    if (size === "sm") {
      sizeClass = "text-sm";
      if (hasActualIcon) {
        paddingClass = "py-1.5 pr-3 pl-[10px]";
      } else {
        paddingClass = "py-1.5 px-3";
      }
    } else {
      // md (default)
      paddingClass = hasActualIcon ? "py-2 pr-4 pl-[14px]" : "py-2 px-4";
    }

    // Prefer icon/label props if provided, fallback to children for backward compatibility
    let content: React.ReactNode;
    if (rest.icon || rest.label) {
      content = (
        <span className="flex items-center justify-center gap-1">
          {iconRight ? (
            <>
              {rest.label}
              {rest.icon}
            </>
          ) : (
            <>
              {rest.icon}
              {rest.label}
            </>
          )}
        </span>
      );
    } else {
      content = rest.children;
    }
    // Add border-gradient-inner and bg-white for secondary variant
    const extraSecondaryClasses =
      variant === "secondary" ? "border-gradient-inner bg-white" : "";

    return (
      <button
        ref={ref}
        type={rest.type || "button"}
        className={[
          "cursor-pointer rounded-full font-semibold transition-colors focus:ring-0 focus:outline-none shadow-[0_0_0_2px_rgba(0,0,0,0.04)]",
          variantStyles,
          sizeClass,
          paddingClass,
          extraSecondaryClasses,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
