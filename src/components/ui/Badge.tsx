interface BadgeProps {
  label: string
  color?: string
  className?: string
}

export function Badge({ label, color = '#3b82f6', className = '' }: BadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${className}`}
      style={{ background: color }}
    >
      {label}
    </span>
  )
}