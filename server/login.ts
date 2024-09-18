'use server'

import { AuthService } from '@/gen/proto/v1/auth_connect'
import { auth } from '@/lib/firebase'
import { createPromiseClient } from '@connectrpc/connect'

import type { Patient } from '@/gen/proto/v1/patient_pb'
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { transport, withErrorHandling } from './api'

interface LoginParams {
  email: string
  password: string
  csrfToken: string
}

const client = createPromiseClient(AuthService, transport)

async function login(params: LoginParams) {
  const { email, password } = params

  const response = await client.login({
    email,
    password,
  })
  return {
    token: response.token,
  }
}

async function registerFirebase(params: Patient, password: string) {
  return withErrorHandling(async () => {
    const patient = await client.registerPatient({ patient: params })
    if (patient.patient) {
      await createUserWithEmailAndPassword(auth, params.email, password)
    }
    return patient.patient
  })
}

async function sendPasswordResetEmailFirebase(email: string) {
  return await sendPasswordResetEmail(auth, email)
}

async function confirmThePasswordResetFirebase(
  oobCode: string,
  newPassword: string,
) {
  if (!oobCode && !newPassword) return

  return await confirmPasswordReset(auth, oobCode, newPassword)
}

export {
  confirmThePasswordResetFirebase,
  login,
  registerFirebase,
  sendPasswordResetEmailFirebase,
}
