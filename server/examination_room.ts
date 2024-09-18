'use server'

import { ExaminationRoomService } from '@/gen/proto/v1/examination_room_connect'
import { createPromiseClient } from '@connectrpc/connect'

import { transport, withErrorHandling } from './api'

const client = createPromiseClient(ExaminationRoomService, transport)

const examinationRoomList = async (roomId?: number, menuId?: number) => {
  return withErrorHandling(async () => {
    const response = await client.examinationRoomList({ roomId, menuId })
    return response.rooms
  })
}

const createExaminationRoom = async (roomId: number, menuId: number) => {
  return withErrorHandling(async () => {
    const response = await client.createExaminationRoom({ roomId, menuId })
    return response
  })
}

const deleteExaminationRoom = async (roomId?: number, menuId?: number) => {
  return withErrorHandling(async () => {
    const response = await client.deleteExaminationRoom({ roomId, menuId })
    return response
  })
}

export { createExaminationRoom, deleteExaminationRoom, examinationRoomList }
