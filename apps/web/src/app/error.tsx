"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="px-6 py-16">
      <ErrorState
        title="The operating system hit an unexpected fault"
        description="A rendering or data boundary failed while preparing this page. Retry to recover the session."
        onRetry={reset}
        className="mx-auto max-w-2xl"
      />
    </div>
  );
}
