import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// Base styles separated for clarity and reusability
const BASE_BUTTON_STYLES = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "whitespace-nowrap",
  "rounded-md",
  "text-sm",
  "font-medium",
  "ring-offset-background",
  "transition-colors",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
  "disabled:pointer-events-none",
  "disabled:opacity-50",
  "[&_svg]:pointer-events-none",
  "[&_svg]:size-4",
  "[&_svg]:shrink-0",
].join(" ");

// Variant definitions with improved organization
const VARIANT_STYLES = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  hero: [
    "bg-primary",
    "text-primary-foreground",
    "hover:bg-primary/90",
    "shadow-[0_0_30px_hsl(42_74%_52%_/_0.3)]",
    "hover:shadow-[0_0_40px_hsl(42_74%_52%_/_0.5)]",
    "transition-all",
    "duration-300",
  ].join(" "),
  "hero-outline": [
    "border-2",
    "border-primary",
    "bg-transparent",
    "text-foreground",
    "hover:bg-primary/10",
    "hover:border-primary-glow",
    "transition-all",
    "duration-300",
  ].join(" "),
} as const;

const SIZE_STYLES = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
} as const;

// CVA configuration
const buttonVariants = cva(BASE_BUTTON_STYLES, {
  variants: {
    variant: VARIANT_STYLES,
    size: SIZE_STYLES,
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// Type definitions
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Component with improved structure
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    // Determine component type
    const Component = asChild ? Slot : "button";
    
    // Compute classes once
    const buttonClasses = React.useMemo(
      () => cn(buttonVariants({ variant, size }), className),
      [variant, size, className]
    );

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : type}
        className={buttonClasses}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

// Named exports
export { Button, buttonVariants };

// Type exports for convenience
export type ButtonVariant = keyof typeof VARIANT_STYLES;
export type ButtonSize = keyof typeof SIZE_STYLES;