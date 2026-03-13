import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-12 w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/75 px-4 pr-11 text-sm text-white outline-none transition-all duration-300 focus:border-cyan-300/30 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-300/15",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
