import { createElement } from 'react'

/**
 * Process step: left-rail timeline on mobile (line beside icon, text to the right).
 * Centered horizontal layout at lg+.
 */
export default function ProcessStep({
  step,
  title,
  description,
  icon,
  showConnector = false,
  stepLabel,
  compact = false,
}) {
  const label = stepLabel ?? `Step ${step}`

  const iconBoxClass = compact
    ? 'border-secondary/18 shadow-[0_2px_10px_-4px_rgba(65,114,244,0.2)] group-hover:shadow-[0_8px_24px_-8px_rgba(65,114,244,0.35)]'
    : 'border-secondary/15 shadow-[0_2px_12px_-4px_rgba(65,114,244,0.22)] group-hover:shadow-[0_10px_28px_-8px_rgba(65,114,244,0.38)]'

  const labelClass = compact
    ? 'text-[0.625rem] font-bold tracking-[0.18em]'
    : 'text-[0.6875rem] font-semibold tracking-[0.22em]'

  return (
    <li className="group relative grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-4 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-x-5 lg:flex lg:flex-1 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
      <div className="relative flex justify-center lg:w-auto">
        {showConnector ? (
          <div
            className="pointer-events-none absolute left-1/2 top-12 bottom-0 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-secondary/40 via-secondary/25 to-secondary/12 lg:hidden"
            aria-hidden
          />
        ) : null}
        <div
          className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-white text-secondary transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-secondary/32 group-hover:bg-[#f8faff] ${iconBoxClass}`}
        >
          {createElement(icon, {
            className: compact ? 'h-[1.125rem] w-[1.125rem]' : undefined,
          })}
        </div>
      </div>

      <div
        className={`min-w-0 text-left lg:mt-5 lg:flex lg:flex-col lg:items-center lg:text-center ${showConnector ? 'pb-10 sm:pb-12' : ''} lg:pb-0`}
      >
        <span
          className={`${labelClass} uppercase text-secondary/90 transition-colors duration-300 group-hover:text-secondary`}
        >
          {label}
        </span>
        <h3
          className={`mt-2 font-semibold tracking-tight text-primary ${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl lg:mt-3'}`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 max-w-md text-pretty leading-relaxed text-textSecondary ${compact ? 'text-sm' : 'mt-3 text-sm sm:mt-3.5 sm:text-base'} lg:max-w-[18rem]`}
        >
          {description}
        </p>
      </div>
    </li>
  )
}
