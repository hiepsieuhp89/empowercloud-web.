'use server'

import { ScheduleListService } from '@/gen/proto/v1/schedule_list_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

interface ReceptionListParams {
  fromDate: string | undefined
  toDate: string | undefined
  doctor: number | undefined
  mode: string | undefined
  page: number | undefined
  size: number | undefined
}

const client = createPromiseClient(ScheduleListService, transport)

async function scheduleList(params: ReceptionListParams) {
  return withErrorHandling(async () => {
    const { fromDate, toDate, doctor, mode, page, size } = params

    const response = await client.scheduleList({
      fromDate,
      toDate,
      doctor,
      mode,
      page,
      size,
    })
    return {
      receptions: response.list,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

export { scheduleList }
