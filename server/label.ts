'use server'

import { createPromiseClient } from '@connectrpc/connect'
import { LabelService } from './../gen/proto/v1/label_connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(LabelService, transport)

export type CreateLabelRequest = {
  name: string
  color: string
  description: string
}

const createLabel = async (params: CreateLabelRequest) => {
  return withErrorHandling(async () => {
    const { name, color, description } = params
    try {
      const response = await client.createLabel({ name, color, description })
      return response.label
    } catch (e) {
      console.log('error is', e)
      return null
    }
  })
}

type LabelListRequest = {
  keyword: string
  page: number
  size: number
}

const labelList = async (params: LabelListRequest) => {
  return withErrorHandling(async () => {
    const response = await client.labelList({
      keyword: params.keyword,
      page: params.page,
      size: params.size,
    })

    return {
      labels: response.labels,
      page: response.currentPage,
      total: response.total,
      size: response.size,
    }
  })
}

const deleteLabel = async (id: number) => {
  return withErrorHandling(async () => {
    const response = await client.deleteLabel({ id: BigInt(id) })
    return response.message
  })
}

export type UpdateLabelRequest = {
  id: bigint
  name: string
  color: string
  description: string
  sort?: number
}

const updateLabel = async (param: UpdateLabelRequest) => {
  return withErrorHandling(async () => {
    const { id, name, color, description, sort } = param
    const response = await client.updateLabel({
      id,
      name,
      color,
      description,
      sort,
    })

    return response.message
  })
}

export { createLabel, deleteLabel, labelList, updateLabel }
