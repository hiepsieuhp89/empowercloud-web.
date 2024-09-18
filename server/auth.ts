'use server'

import { AuthService } from '@/gen/proto/v1/auth_connect'
import type { AccessRole, SessionUser } from '@/utils/type'
import { createPromiseClient } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'
import { withErrorHandling } from './api'

const transport = createConnectTransport({
  baseUrl: process.env.API_ENDPOINT || 'http://localhost:5001',
})

const client = createPromiseClient(AuthService, transport)

async function getUserInfo(jwt: string): Promise<SessionUser | undefined> {
  return withErrorHandling(async () => {
    try {
      const response = await client.getUserInfo({
        jwt,
      })
      return {
        id: String(response.id),
        jwt: response.jwt,
        email: response.email,
        role: response.role as AccessRole,
        clinic_id: response.clinicId,
      }
    } catch (e) {
      console.error('error client verify', e)
      //Handle exception
      return undefined
    }
  })
}

export { getUserInfo }
