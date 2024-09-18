'use server'

import authOptions from '@/app/api/auth/[...nextauth]'
import { PatientService } from '@/gen/proto/v1/patient_connect'
import type { PatientInput, SessionUser } from '@/utils/type'
import { createPromiseClient } from '@connectrpc/connect'
import { getServerSession } from 'next-auth/next'
import { transport, withErrorHandling } from './api'
import { hashString } from './verify'

const client = createPromiseClient(PatientService, transport)

async function detailPatient(id: number) {
  return withErrorHandling(async () => {
    const response = await client.detailPatient({ id })
    return response.patient
  })
}

async function searchPatient(id: number) {
  return withErrorHandling(async () => {
    const response = await client.searchPatient({ id })
    return response.patient
  })
}

async function listPatients(page: number, size?: number, keyword?: string) {
  return withErrorHandling(async () => {
    const response = await client.listPatients({
      size: size || 50,
      page,
      keyword,
    })
    return response
  })
}

async function removeLineUser() {
  return withErrorHandling(async () => {
    const response = await client.updateLine({
      lineId: '',
    })
    return response.patient
  })
}

interface TokenResponse {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
  id_token: string
}

async function addLineUser(code: string, state: string) {
  return withErrorHandling(async () => {
    const tokenEndpoint = 'https://api.line.me/oauth2/v2.1/token'

    const session = (await getServerSession(authOptions))?.user as SessionUser
    if (state != hashString(session.email)) {
      throw 'invalid state'
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_secret: process.env.LINE_CHANNEL_SECRET as string,
      client_id: process.env.LINE_CHANNEL_ID as string,
      redirect_uri: `${process.env.NEXTAUTH_URL}/home`,
    })

    const resLine = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const tokenData: TokenResponse = await resLine.json()
    if (tokenData.id_token) {
      const response = await client.updateLine({
        lineId: tokenData.id_token,
      })
      return response.patient
    }
    throw 'token invalid'
  })
}

async function userInfo() {
  return withErrorHandling(async () => {
    const response = await client.userInfo({})
    return response.patient
  })
}

async function storePatient(data: PatientInput) {
  return withErrorHandling(async () => {
    await client.storePatient(data)
  })
}

export {
  addLineUser,
  detailPatient,
  listPatients,
  removeLineUser,
  searchPatient,
  storePatient,
  userInfo,
}
