import Link from "next/link";
import { Compass } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="px-6 py-16">
      <EmptyState
        title="Worldline not found"
        description="The page or replay branch you requested does not exist in the current simulation field."
        icon={Compass}
        action={
          <Link href="/simulation" className={buttonVariants({ size: "lg" })}>
            Return to Simulation
          </Link>
        }
        className="mx-auto max-w-2xl"
      />
    </div>
  );
}
