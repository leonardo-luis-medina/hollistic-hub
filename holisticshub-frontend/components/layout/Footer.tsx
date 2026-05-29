import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a1628] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* brand */}
        <div className="flex items-center gap-2">
          <span className="text-[#4fffb0] font-bold text-lg">🌿 HolisticsHub</span>
          <span className="text-white/30 text-sm">— healing through community</span>
        </div>

        {/* links */}
        <div className="flex items-center gap-6 text-sm text-white/40">
          <Link href="/protocols" className="hover:text-white/70 transition-colors">
            Protocols
          </Link>
          <Link href="/threads" className="hover:text-white/70 transition-colors">
            Threads
          </Link>
          <Link href="/search" className="hover:text-white/70 transition-colors">
            Search
          </Link>
        </div>

        {/* credit */}
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} HolisticsHub. Built with Next.js & Laravel.
        </p>
      </div>
    </footer>
  )
}