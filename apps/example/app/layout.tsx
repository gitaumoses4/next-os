import type { Metadata } from 'next'
import { Providers } from './providers'
import { OSLayout } from './os-layout'
import './globals.css'

export const metadata: Metadata = {
  title: 'deskui example',
  description: 'A demo SaaS app wrapped in deskui',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="bg-background text-foreground antialiased">
        <Providers>
          <OSLayout>{children}</OSLayout>
        </Providers>
      </body>
    </html>
  )
}
