'use client'

interface AppIconProps {
  icon: React.ReactNode
  size: number
  borderRadius?: number
  className?: string
}

export function AppIcon({ icon, size, borderRadius, className }: AppIconProps) {
  if (typeof icon === 'string') {
    return (
      <img
        src={icon}
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          borderRadius: borderRadius ?? size * 0.2,
        }}
        className={className}
        draggable={false}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      className={className}
    >
      {icon}
    </div>
  )
}
