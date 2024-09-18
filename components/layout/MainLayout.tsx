import '@/app/globals.css'
import type { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'empowercloud',
  description: 'empowercloud',
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex h-screen items-center justify-center bg-background-normal">
      <div className="flex h-screen items-center text-black">
        <div className="justify-center">
          <img
            className="mx-auto max-w-96"
            src="./empowercloud_logo.png"
            alt=""
          />
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </main>
  )
}
