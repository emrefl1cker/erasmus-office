import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FBÜ Erasmus+ Ofis Araçları',
  description: 'Fenerbahçe Üniversitesi Uluslararası Ofisi — İlan ve Mail Yönetim Araçları',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
