// pages/signout.tsx
'use client'
import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

const SignOutPage = () => {
  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({ callbackUrl: '/' }) // Redirect to home after sign out
    }

    handleSignOut()
  }, [])

  return <p>Signing out...</p> // Optional: You can add a loading indicator
}

export default SignOutPage
