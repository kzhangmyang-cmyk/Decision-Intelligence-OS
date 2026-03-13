import { LoadingState } from "@/components/feedback/loading-state";

export default function RootLoading() {
  return (
    <LoadingState
      fullScreen
      title="Booting Astrological Decision Simulator"
      description="Syncing symbolic signals, worldline state, and replay layers."
    />
  );
}
