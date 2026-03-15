import React from "react";
import clsx from "clsx";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "icon";
  loading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading, className, children, ...props }, ref) => {
    // If icon button, require aria-label
    const ariaLabel = props["aria-label"] || (variant === "icon" ? "Button" : undefined);
    return (
      <button
        ref={ref}
        className={clsx(
          "px-4 py-2 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition",
          variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "secondary" && "bg-gray-200 text-gray-800 hover:bg-gray-300",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
          variant === "icon" && "p-2 bg-transparent text-gray-600 hover:bg-gray-100",
          loading && "opacity-60 cursor-not-allowed",
          className
        )}
        disabled={loading || props.disabled}
        aria-busy={loading}
        aria-label={ariaLabel}
        {...props}
      >
        {loading ? <span className="loader mr-2" aria-label="Loading" /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
