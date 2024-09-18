'use server'

import { ClinicService } from '@/gen/proto/v1/clinic_connect'
import type { Clinic } from '@/gen/proto/v1/clinic_pb'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(ClinicService, transport)

async function clinicList(keyword: string, page: number, size: number) {
  return withErrorHandling(async () => {
    const response = await client.clinicList({
      keyword,
      page,
      size,
    })
    return {
      clinics: response.clinics,
      total: response.total,
    }
  })
}

async function storeClinic(params: Clinic) {
  return withErrorHandling(async () => {
    const response = await client.storeClinic({
      clinic: params,
    })
    return response
  })
}

export { clinicList, storeClinic }
