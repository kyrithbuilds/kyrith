import { Link } from 'react-router-dom'

const linkClass = 'font-medium text-secondary underline-offset-2 hover:underline'

/** Render "[text](url)" links in copy: internal paths use the router, everything else is a plain anchor. */
export default function InlineLinks({ text }) {
  const parts = []
  let last = 0
  for (const match of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const [, label, href] = match
    parts.push(
      href.startsWith('/') ? (
        <Link key={match.index} to={href} className={linkClass}>
          {label}
        </Link>
      ) : (
        <a
          key={match.index}
          href={href}
          className={linkClass}
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      ),
    )
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}
