import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>next-os example</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        This app will be wrapped in an OS shell. For now, here are the routes:
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/dashboard" style={{ color: '#0070f3' }}>
          /dashboard
        </Link>
        <Link href="/settings" style={{ color: '#0070f3' }}>
          /settings
        </Link>
        <Link href="/notes" style={{ color: '#0070f3' }}>
          /notes
        </Link>
      </nav>
    </div>
  )
}
