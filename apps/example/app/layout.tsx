import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'next-os example',
  description: 'A demo SaaS app wrapped in next-os',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
