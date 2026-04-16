import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center gap-2 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary px-5 py-3 text-primary-foreground shadow-[0_10px_30px_rgba(37,29,24,0.08)] hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-[0_16px_40px_rgba(37,29,24,0.12)]",
        secondary:
          "bg-secondary px-5 py-3 text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/82",
        ghost: "px-4 py-2 text-foreground hover:bg-secondary/70"
      },
      size: {
        default: "min-h-10",
        lg: "min-h-12 px-6 py-3.5 text-[15px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
