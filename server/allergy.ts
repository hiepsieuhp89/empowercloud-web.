'use server'

import { AllergyListService } from '@/gen/proto/v1/allergy_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

interface AllergyListParams {
  page: number
}

const client = createPromiseClient(AllergyListService, transport)

async function allergyList(params: AllergyListParams) {
  return withErrorHandling(async () => {
    const { page } = params

    const response = await client.allergyList({
      page,
    })
    return {
      allergies: response.allergies,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

export { allergyList }
