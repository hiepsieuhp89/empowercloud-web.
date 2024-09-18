import type { SessionUser } from '@/utils/type'
import { ConnectError, type Interceptor } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'

import authOptions from '@/app/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const addAuthHeaders: Interceptor = (next) => async (request) => {
  const session = await getServerSession(authOptions)
  const sessionUser = session?.user as SessionUser

  if (sessionUser && sessionUser?.jwt) {
    request.header.set('Authorization', `Bearer ${sessionUser.jwt}`)
  }
  return await next(request)
}

const transport = createConnectTransport({
  baseUrl: process.env.API_ENDPOINT || 'http://localhost:5001',
  interceptors: [addAuthHeaders],
})

async function withErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof ConnectError) {
      console.log(
        'error is ',
        err.metadata,
        ' vs code: ',
        err.code,
        'vs detail: ',
        err.details,
        ' vs rawMessage: ',
        err.rawMessage,
        ' cause: ',
        err.cause,
      )
      if (
        err.rawMessage == 'token is invalid' ||
        err.rawMessage == 'token has expired'
      ) {
        //await logout()
        //await signOut({redirect: false})
        return redirect('/signout')
      }
    } else {
      console.error('An unexpected error occurred:', err)
    }
    throw err
  }
}

export { transport, withErrorHandling }
