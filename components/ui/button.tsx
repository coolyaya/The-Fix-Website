import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fix-blue/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:h-5 [&_svg]:w-5",
  {
    variants: {
      variant: {
        default: "bg-fix-pink text-fix-white shadow-soft hover:bg-fix-blue",
        secondary: "bg-fix-blue/10 text-fix-blue shadow-none hover:bg-fix-blue hover:text-fix-white",
        outline: "border border-fix-blue/20 bg-fix-white text-fix-blue shadow-none hover:bg-fix-blue hover:text-fix-white",
        ghost: "text-fix-blue hover:text-fix-pink",
        destructive:
          "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90",
        link: "text-fix-blue underline-offset-4 hover:text-fix-pink hover:underline",
      },
      size: {
        default: "px-5 py-2.5 text-sm",
        sm: "px-4 py-2 text-xs",
        lg: "px-6 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
