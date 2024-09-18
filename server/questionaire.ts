'use server'

import { QuestionaireService } from '@/gen/proto/v1/questionaire_connect'
import type { Questionaire } from '@/gen/proto/v1/questionaire_pb'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(QuestionaireService, transport)

const detailQuestionaire = async (receptionId: number) => {
  return withErrorHandling(async () => {
    const response = await client.detailAnswer({ receptionId })
    return response
  })
}

const storeQuestionaire = async (questionaire: Questionaire) => {
  return withErrorHandling(async () => {
    const response = await client.storeAnswer({ questionaire })
    return response
  })
}

export { detailQuestionaire, storeQuestionaire }
