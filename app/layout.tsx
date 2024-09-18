import type { Metadata } from 'next'
import React, { Suspense } from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: 'empowercloud',
  description: 'empowercloud',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //const session = await getSession(headers().get('cookie') ?? '')
  return (
    <html lang="ja">
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
