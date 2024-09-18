'use server'

import { ReceptionService } from '@/gen/proto/v1/reception_list_connect'
import type { ReceptionInput } from '@/utils/type'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'
interface ReceptionListParams {
  fromDate: string | undefined
  toDate: string | undefined
  assignTo: number | undefined
  sortAppointmentTime: string | undefined
  sortReservationTime: string | undefined
  status: number[] | undefined
  page: number | undefined
  size: number | undefined
}

const client = createPromiseClient(ReceptionService, transport)

async function receptionList(params: ReceptionListParams) {
  return withErrorHandling(async () => {
    const {
      fromDate,
      toDate,
      assignTo,
      sortAppointmentTime,
      sortReservationTime,
      status,
      page,
      size,
    } = params

    const response = await client.receptionList({
      fromDate,
      toDate,
      assignTo,
      sortAppointmentTime,
      sortReservationTime,
      status,
      page,
      size,
    })

    return {
      receptions: response.receptions,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

async function firstReceptionList(params: ReceptionListParams) {
  return withErrorHandling(async () => {
    const {
      fromDate,
      toDate,
      assignTo,
      sortAppointmentTime,
      sortReservationTime,
      status,
      page,
      size,
    } = params

    const response = await client.firstReceptionList({
      fromDate,
      toDate,
      assignTo,
      sortAppointmentTime,
      sortReservationTime,
      status,
      page,
      size,
    })

    return {
      receptions: response.receptions,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

async function receptionDetail(id: number) {
  return withErrorHandling(async () => {
    const response = await client.getDetailReception({ id: BigInt(id) })
    return response.reception
  })
}

async function patientReceptionList(patientId: number) {
  return withErrorHandling(async () => {
    const response = await client.patientReceptionList({ patientId })
    return response.receptions
  })
}

export interface CreateReceptionParams {
  appointmentTime: string
  examinationId: number
  memoContent?: string
  firstName?: string
  lastName?: string
  firstNameFurigana?: string
  lastNameFurigana?: string
  phoneNumber?: string
  birthDate?: string
  doctorId: number
  patientId?: number
  lineId?: string
}

async function createReception(params: CreateReceptionParams) {
  return withErrorHandling(async () => {
    const {
      appointmentTime,
      examinationId,
      memoContent,
      firstName,
      lastName,
      firstNameFurigana,
      lastNameFurigana,
      phoneNumber,
      birthDate,
      doctorId,
      patientId,
      lineId,
    } = params

    const response = await client.createReception({
      appointmentTime,
      examinationId,
      memoContent,
      firstName,
      firstNameFurigana,
      phoneNumber,
      birthDate,
      doctorId,
      patientId,
      lastName,
      lastNameFurigana,
      lineId,
    })

    return response.receptionId
  })
}

export interface RegisterReceptionParams {
  appointmentTime: string
  examinationId: number
  memoContent: string
  doctorId: number
  patientId: number
}

async function registerReception(params: RegisterReceptionParams) {
  return withErrorHandling(async () => {
    const { appointmentTime, examinationId, memoContent, doctorId, patientId } =
      params

    const response = await client.createReception({
      appointmentTime,
      examinationId,
      memoContent,
      doctorId,
      patientId,
      birthDate: '2000-01-01',
    })

    return response.receptionId
  })
}

async function updateReceptionLabel(receptionId: bigint, labelId: bigint) {
  return withErrorHandling(async () => {
    const response = await client.updateReceptionLabel({ receptionId, labelId })
    return response.message
  })
}

async function updateReception(
  receptionId: bigint,
  status?: number,
  doctorId?: bigint,
  receptionTime?: string,
) {
  return withErrorHandling(async () => {
    const response = await client.updateReception({
      receptionId,
      status,
      doctorId,
      receptionTime,
    })
    return response.reception
  })
}

async function storeReception(reception: ReceptionInput) {
  return withErrorHandling(async () => {
    const response = await client.storeReception(reception)
    return response
  })
}

async function getCompletedReception(fromDate: string, toDate: string) {
  return withErrorHandling(async () => {
    const response = await client.getCompleteReception({ fromDate, toDate })
    return {
      completed: response.completeReception,
      total: response.totalReception,
    }
  })
}

async function getScheduleReception(
  menuId?: number,
  doctorId?: number,
  fromDate?: string,
  toDate?: string,
) {
  return withErrorHandling(async () => {
    const response = await client.getReceptionSchedule({
      menuId,
      doctorId: BigInt(doctorId || 0),
      fromDate,
      toDate,
    })
    return response
  })
}

async function getUserReceptions() {
  return withErrorHandling(async () => {
    const response = await client.userReceptionList({
      page: 1,
      size: 50,
    })
    return response
  })
}

export {
  createReception,
  firstReceptionList,
  getCompletedReception,
  getScheduleReception,
  getUserReceptions,
  patientReceptionList,
  receptionDetail,
  receptionList,
  registerReception,
  storeReception,
  updateReception,
  updateReceptionLabel,
}
