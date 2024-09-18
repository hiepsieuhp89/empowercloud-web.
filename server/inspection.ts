'use server'

import { InspectionListService } from '@/gen/proto/v1/inspection_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

interface InspectionListParams {
  page: number
}

const client = createPromiseClient(InspectionListService, transport)

async function inspectionList(params: InspectionListParams) {
  return withErrorHandling(async () => {
    const { page } = params

    const response = await client.inspectionList({
      page,
    })
    return {
      inspections: response.inspections,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

export { inspectionList }
