import { useEffect } from 'react'
import { testContactApi } from '../api/contact'

export default function Home() {
  useEffect(() => {
    testContactApi().catch((err) => console.error('Contact API error:', err))
  }, [])

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-neutral-50 px-4 py-8">
      <p className="text-center text-lg text-neutral-600">
        Website is being built
      </p>
    </main>
  )
}
