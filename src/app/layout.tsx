import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Elit\'arte - Movimento Artístico Angolano',
  description: 'Movimento artístico que celebra e preserva a rica cultura angolana através da fusão harmoniosa entre tradição e contemporaneidade',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
