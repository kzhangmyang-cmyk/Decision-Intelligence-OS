import { LoadingState } from "@/components/feedback/loading-state";

export default function RootLoading() {
  return (
    <LoadingState
      fullScreen
      title="Booting Decision Intelligence OS"
      description="Syncing the strategic interface, worldline state, and decision layers."
    />
  );
}
