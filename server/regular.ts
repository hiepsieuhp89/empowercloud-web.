'use server'

import { EffectRegularListService } from '@/gen/proto/v1/effect_regular_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

interface RegularListParams {
  page: number
}

const client = createPromiseClient(EffectRegularListService, transport)

async function effectRegularList(params: RegularListParams) {
  return withErrorHandling(async () => {
    const { page } = params

    const response = await client.effectRegularList({
      page,
    })
    return {
      regulars: response.regulars,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

export { effectRegularList }
