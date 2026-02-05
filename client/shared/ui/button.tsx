"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-transparent border border-brand-charcoal/20 
    hover:border-brand-charcoal
    [&>div:first-child]:bg-brand-charcoal 
    [&>div:first-child]:translate-y-full 
    [&>div:first-child]:hover:translate-y-0
    [&_.btn-content]:group-hover:text-brand-beige
    [&_.corner]:bg-brand-charcoal 
    [&_.corner]:group-hover:bg-brand-beige
  `,
  secondary: `
    bg-brand-charcoal border border-brand-charcoal
    hover:bg-brand-charcoal/90
    [&_.btn-content]:text-brand-beige
    [&_.corner]:bg-brand-beige
  `,
  ghost: `
    bg-transparent border border-transparent
    hover:bg-brand-charcoal/5
    [&_.btn-content]:text-brand-charcoal
  `,
  outline: `
    bg-transparent border border-brand-charcoal/40
    hover:border-brand-charcoal
    [&_.btn-content]:text-brand-charcoal
    [&_.corner]:bg-brand-charcoal
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-8 py-3 text-[10px]",
  md: "px-12 py-4 text-[11px]",
  lg: "px-16 py-5 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "lg",
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const showCorners = variant === "primary" || variant === "outline";
    const showOverlay = variant === "primary";

    return (
      <button
        ref={ref}
        className={`
          group relative overflow-hidden cursor-pointer
          transition-all duration-300
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {/* Hover overlay for primary variant */}
        {showOverlay && (
          <div className="absolute inset-0 transition-transform duration-300" />
        )}

        {/* Content */}
        <div className="btn-content relative z-10 flex items-center justify-center gap-3">
          <span className="font-bold tracking-[0.3em] transition-colors">
            {children}
          </span>
        </div>

        {/* Corner decorations */}
        {showCorners && (
          <>
            <div className="corner absolute top-0 left-0 w-1 h-1 transition-colors" />
            <div className="corner absolute bottom-0 right-0 w-1 h-1 transition-colors" />
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
