import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-300/30 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-300/15",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
