'use server'

import { RoomTypeService } from '@/gen/proto/v1/room_type_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(RoomTypeService, transport)

const roomTypeList = async () => {
  return withErrorHandling(async () => {
    const response = await client.roomTypeList({})
    return response.roomTypes
  })
}

const createRoomType = async (type: string, info: string) => {
  return withErrorHandling(async () => {
    const response = await client.createRoomType({ type, info })
    return response
  })
}

export { createRoomType, roomTypeList }
