export function ConsolePageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
        <div className="h-3 w-28 rounded-full bg-white/10" />
        <div className="mt-5 h-10 w-2/3 rounded-2xl bg-white/10" />
        <div className="mt-4 h-5 w-4/5 rounded-2xl bg-white/10" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="mt-5 h-9 w-1/2 rounded-2xl bg-white/10" />
            <div className="mt-4 h-4 w-3/4 rounded-2xl bg-white/10" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="h-3 w-24 rounded-full bg-white/10" />
          <div className="mt-5 h-8 w-1/2 rounded-2xl bg-white/10" />
          <div className="mt-6 h-[280px] rounded-[24px] bg-white/[0.04]" />
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="h-3 w-24 rounded-full bg-white/10" />
          <div className="mt-5 h-8 w-1/2 rounded-2xl bg-white/10" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 rounded-[22px] bg-white/[0.04]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
