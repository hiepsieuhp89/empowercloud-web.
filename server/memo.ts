'use server'

import { MemoService } from '@/gen/proto/v1/memo_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(MemoService, transport)

const createMemo = async (receptionId: bigint, content: string) => {
  return withErrorHandling(async () => {
    const response = await client.createMemo({ receptionId, content })
    return response.memo
  })
}

const updateMemo = async (id: bigint, content: string) => {
  return withErrorHandling(async () => {
    const response = await client.updateMemo({ id, content })
    return response.memo
  })
}

const memoList = async (receptionId: bigint) => {
  return withErrorHandling(async () => {
    const response = await client.memoList({ receptionId })
    return response.memos
  })
}

const deleteMemo = async (id: bigint) => {
  return withErrorHandling(async () => {
    const response = await client.deleteMemo({ id })
    return response.message
  })
}

export { createMemo, deleteMemo, memoList, updateMemo }
