/**
 * Premium card: white surface, soft shadow, optional hover lift.
 */
export default function Card({
  children,
  className = '',
  hover = true,
  as = 'div',
  ...props
}) {
  const Comp = as
  const hoverStyles = hover
    ? 'transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-secondary/22 hover:shadow-[0_14px_36px_-12px_rgba(65,114,244,0.2),0_4px_12px_-4px_rgba(2,29,65,0.06)]'
    : ''

  return (
    <Comp
      className={`rounded-[11px] border border-border bg-background p-6 shadow-card ${hoverStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </Comp>
  )
}
