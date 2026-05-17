/**
 * Vertical section rhythm; optional muted background (section token).
 */
const variants = {
  default: 'bg-background',
  muted: 'bg-section',
}

export default function Section({
  children,
  className = '',
  variant = 'default',
  as = 'section',
  ...props
}) {
  const Comp = as
  const variantBg = variants[variant] ?? variants.default
  const hasCustomBg = /\bbg-/.test(className)
  const bg = hasCustomBg ? '' : variantBg

  return (
    <Comp
      className={`py-14 sm:py-18 lg:py-22 ${bg} ${className}`.trim()}
      {...props}
    >
      {children}
    </Comp>
  )
}
