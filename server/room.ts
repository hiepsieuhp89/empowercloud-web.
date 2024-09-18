'use server'

import { RoomService } from '@/gen/proto/v1/room_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(RoomService, transport)

const roomList = async (
  keyword: string,
  typeId: number,
  page: number,
  size: number,
) => {
  return withErrorHandling(async () => {
    const response = await client.roomList({
      keyword,
      typeId,
      page,
      size,
    })
    return {
      rooms: response.rooms,
      total: response.total,
    }
  })
}

const createRoom = async (
  roomName: string,
  roomInfo: string,
  typeId: number,
) => {
  return withErrorHandling(async () => {
    const response = await client.createRoom({
      roomName,
      roomInfo,
      typeId,
    })
    return response
  })
}

const updateRoom = async (
  id: number,
  roomName: string,
  roomInfo: string,
  typeId: number,
  sort?: number,
) => {
  return withErrorHandling(async () => {
    const response = await client.updateRoom({
      id,
      roomName,
      roomInfo,
      typeId,
      sort,
    })
    return response
  })
}

const deleteRoom = async (id: number) => {
  return withErrorHandling(async () => {
    const response = await client.deleteRoom({ id })
    return response
  })
}

export { createRoom, deleteRoom, roomList, updateRoom }
