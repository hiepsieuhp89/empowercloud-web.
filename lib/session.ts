// Import necessary dependencies
import { getSession } from 'next-auth/react'

// Function to get the current user session
export async function getCurrentUserSession() {
  // Get the user session
  const session = await getSession()

  // Check if there is a session
  if (!session) {
    // User is not authenticated, handle accordingly
    return null
  }

  // User is authenticated, return session
  return session
}
