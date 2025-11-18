import './globals.css'
import { Inter } from 'next/font/google'
import RootLayoutClient from './layout-client'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Elit\'Arte',
  description: 'Movimento Artístico que celebra e preserva a rica cultura angolana através da fusão harmoniosa entre tradição e contemporaneidade',
  icons: {
    icon: '/icon.jpeg',
    shortcut: '/icon.jpeg',
    apple: '/icon.jpeg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
