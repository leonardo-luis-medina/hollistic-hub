import Link from 'next/link'
import { Protocol } from '@/types'
import TagBadge from '@/components/ui/TagBadge'
import Avatar from '@/components/ui/Avatar'
import StarRating from '@/components/ui/StarRating'

type ProtocolCardProps = {
  protocol: Protocol
}

export default function ProtocolCard({ protocol }: ProtocolCardProps) {
  return (
    <Link href={`/protocols/${protocol.slug}`}>
      <div className="
        h-full rounded-xl border border-white/10 bg-white/5 p-5
        hover:border-[#4fffb0]/30 hover:bg-white/8
        transition-all duration-200 cursor-pointer group
      ">
        {/* author */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar name={protocol.user?.name ?? 'Unknown'} size="sm" />
          <span className="text-white/50 text-xs">{protocol.user?.name ?? 'Unknown'}</span>
        </div>

        {/* title */}
        <h3 className="
          text-white font-semibold text-base mb-2 line-clamp-2
          group-hover:text-[#00d4ff] transition-colors
        ">
          {protocol.title}
        </h3>

        {/* excerpt */}
        <p className="text-white/40 text-sm line-clamp-2 mb-4">
          {protocol.content?.replace(/[#*`]/g, '').slice(0, 120)}...
        </p>

        {/* tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {protocol.tags?.slice(0, 3).map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between mt-auto">
          <StarRating value={protocol.avg_rating ?? 0} readonly size="sm" />
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span>👁 {protocol.views ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}