'use server'

import { ShiftService } from '@/gen/proto/v1/shift_connect'
import type {
  ListWorkScheduleRequest,
  StoreShiftItem,
  StoreWorkScheduleItem,
} from '@/gen/proto/v1/shift_pb'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(ShiftService, transport)

async function listShift(clinicId: number) {
  return withErrorHandling(async () => {
    const response = await client.listShift({
      clinicId,
      page: 1,
      size: 100,
    })
    return {
      shifts: response.shifts,
    }
  })
}

async function listWorkSchedule({
  clinicId,
  startDate,
  endDate,
  staffId,
}: ListWorkScheduleRequest) {
  return withErrorHandling(async () => {
    const response = await client.listWorkSchedule({
      clinicId,
      startDate,
      staffId,
      endDate,
    })
    return {
      schedules: response.schedules,
    }
  })
}

async function storeShift(params: StoreShiftItem[]) {
  return withErrorHandling(async () => {
    await client.storeShift({ shifts: params })
    return {
      status: 'OK',
    }
  })
}

async function storeWorkSchedule(params: StoreWorkScheduleItem[]) {
  return withErrorHandling(async () => {
    await client.storeWorkSchedule({ schedules: params })
    return {
      status: 'OK',
    }
  })
}

export { listShift, listWorkSchedule, storeShift, storeWorkSchedule }
