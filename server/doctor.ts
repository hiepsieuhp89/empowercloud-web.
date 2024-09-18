'use server'

import { StaffService } from '@/gen/proto/v1/staff_connect'
import type { StaffInput } from '@/utils/type'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(StaffService, transport)

interface DoctorListParams {
  keyword: string | undefined
  page: number | undefined
  size: number | undefined
  clinnicId: number
}

// interface StoreStaffParams {
//   id?: bigint
//   firstName?: string
//   lastName?: string
//   firstNameFurigana?: string
//   lastNameFurigana?: string
//   type?: string
//   position?: string
//   email?: string
//   meetId?: string
//   medicalLicenseNumber?: string
//   medicalRegistrationNumber?: string
// }

async function getDoctorList(params: DoctorListParams) {
  return withErrorHandling(async () => {
    const { keyword, page, size, clinnicId } = params

    const response = await client.listDoctor({
      keyword,
      clinnicId,
      page: page ?? 1,
      size: size ?? 100,
    })
    return {
      doctors: response.doctors,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

async function getStaffList(params: DoctorListParams) {
  return withErrorHandling(async () => {
    const { keyword, page, size, clinnicId } = params

    const response = await client.listStaff({
      clinnicId,
      keyword,
      page: page ?? 1,
      size: size ?? 100,
    })
    return {
      staffs: response.staffs,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

async function storeStaff(params: StaffInput) {
  return withErrorHandling(async () => {
    const response = await client.storeDoctor(params)
    return {
      id: response.id,
    }
  })
}

export { getDoctorList, getStaffList, storeStaff }
