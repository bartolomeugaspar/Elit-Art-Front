'use client'

import { BackgroundMusicWrapper } from '@/components/BackgroundMusicWrapper'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <BackgroundMusicWrapper />
    </>
  )
}
