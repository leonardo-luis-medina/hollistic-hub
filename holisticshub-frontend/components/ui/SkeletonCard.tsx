export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 animate-pulse">
      {/* top row - avatar + name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-white/10" />
        <div className="h-3 w-32 rounded-full bg-white/10" />
      </div>

      {/* title */}
      <div className="h-4 w-3/4 rounded-full bg-white/10 mb-2" />
      <div className="h-4 w-1/2 rounded-full bg-white/10 mb-4" />

      {/* body lines */}
      <div className="h-3 w-full rounded-full bg-white/10 mb-2" />
      <div className="h-3 w-full rounded-full bg-white/10 mb-2" />
      <div className="h-3 w-2/3 rounded-full bg-white/10 mb-4" />

      {/* tags */}
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full bg-white/10" />
        <div className="h-5 w-20 rounded-full bg-white/10" />
      </div>
    </div>
  )
}