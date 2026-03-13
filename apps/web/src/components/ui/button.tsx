import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-300/90 text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_30px_rgba(34,211,238,0.2)] hover:bg-cyan-200",
        secondary:
          "border border-white/10 bg-white/5 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-cyan-300/30 hover:bg-cyan-400/10",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-12 px-6 text-[15px]",
        sm: "h-9 px-4 text-xs",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
