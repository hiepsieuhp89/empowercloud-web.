'use server'

import authOptions from '@/app/api/auth/[...nextauth]'
import { VerifyService } from '@/gen/proto/v1/verify_connect'
import type { AccessRole, SessionUser } from '@/utils/type'
import { createPromiseClient } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'
import { createHash } from 'crypto'
import { getServerSession } from 'next-auth/next'
import { withErrorHandling } from './api'

interface VerifyParams {
  email: string
  role: AccessRole
  token: string
  type?: string
}

const transport = createConnectTransport({
  baseUrl: process.env.API_ENDPOINT || 'http://localhost:5001',
})

const client = createPromiseClient(VerifyService, transport)

async function verify(params: VerifyParams) {
  return withErrorHandling(async () => {
    const { email, role, token, type } = params
    try {
      const response = await client.verify({
        email,
        role,
        token,
        type,
      })
      return {
        result: response.result,
        jwt: response.jwt,
      }
    } catch (e) {
      console.error('error client verify', e)
      //Handle exception
      return {
        result: 'NG',
      }
    }
  })
}

function hashString(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

async function loginLine() {
  const session = (await getServerSession(authOptions))?.user as SessionUser
  const hashState = hashString(session.email)
  const LINE_AUTH_URL: string = 'https://access.line.me/oauth2/v2.1/authorize'
  const params: string = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINE_CHANNEL_ID as string,
    redirect_uri: `${process.env.NEXTAUTH_URL}/home`,
    state: hashState,
    scope: 'profile openid',
  }).toString()
  return `${LINE_AUTH_URL}?${params}`
}

export { hashString, loginLine, verify }
