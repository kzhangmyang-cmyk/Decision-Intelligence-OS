export function GridBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_85%_10%,_rgba(59,130,246,0.16),_transparent_24%),radial-gradient(circle_at_50%_120%,_rgba(245,158,11,0.12),_transparent_24%),linear-gradient(180deg,#020617_0%,#020817_42%,#02040c_100%)]" />
      <div className="absolute inset-0 bg-grid bg-[size:52px_52px] opacity-[0.14]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(2,6,23,0.28)_55%,rgba(2,6,23,0.88)_100%)]" />
      <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="absolute bottom-[-12rem] right-[-4rem] h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-[120px]" />
    </div>
  );
}
