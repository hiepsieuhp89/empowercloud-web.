'use server'

import { EffectSymptomListService } from '@/gen/proto/v1/effect_symptom_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

interface SymptomListParams {
  page: number
}

const client = createPromiseClient(EffectSymptomListService, transport)

async function effectSymptomList(params: SymptomListParams) {
  return withErrorHandling(async () => {
    const { page } = params

    const response = await client.effectSymptomList({
      page,
    })
    return {
      symptoms: response.symptoms,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

export { effectSymptomList }
