import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[132px] w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm leading-6 text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-300/30 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-300/15",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
