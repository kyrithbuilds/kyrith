/**
 * Centered layout shell: max-width 1200px, horizontal padding.
 */
export default function Container({ children, className = '' }) {
  return (
    <div
      className={`mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 ${className}`.trim()}
    >
      {children}
    </div>
  )
}
