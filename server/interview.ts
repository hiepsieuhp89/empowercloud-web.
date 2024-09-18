'use server'

import { InterviewListService } from '@/gen/proto/v1/interview_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

interface InterviewListParams {
  page: number
  userId: number
}

const client = createPromiseClient(InterviewListService, transport)

async function interviewList(params: InterviewListParams) {
  return withErrorHandling(async () => {
    const { page } = params

    const response = await client.interviewList({
      page,
    })
    return {
      interviews: response.interviews,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

export { interviewList }
