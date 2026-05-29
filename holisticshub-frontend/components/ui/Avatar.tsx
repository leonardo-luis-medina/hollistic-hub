type AvatarProps = {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const colors = [
  'bg-emerald-500', 'bg-cyan-500', 'bg-purple-500',
  'bg-pink-500', 'bg-yellow-500', 'bg-blue-500',
]

function getColor(name: string) {
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

export default function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <div className={`
      ${sizes[size]} ${getColor(name)}
      rounded-full flex items-center justify-center
      font-semibold text-white shrink-0
    `}>
      {getInitials(name)}
    </div>
  )
}