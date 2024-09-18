import type { DataItem } from '@/components/Table'
import type { ScheduleData } from '@/gen/proto/v1/schedule_list_pb'
import type { Session } from 'next-auth'
import type React from 'react'

export interface RenderSchedule {
  (
    value: {
      date: string
      schedules: { title: string; id: number }[]
      isHoliday: boolean
      warning?: string
    }[],
    record: DataItem,
  ): React.JSX.Element
}

export interface RenderWeekSchedule {
  (
    value: {
      date: string
      schedules: { title: string; id: number }[]
      isHoliday: boolean
      warning?: string
    },
    record: ScheduleData,
  ): React.JSX.Element
}

export interface SessionUser {
  id: string
  email: string
  jwt: string
  role: AccessRole
  clinic_id: number
}

export type AccessRole = 'patient' | 'doctor' | 'admin' | 'client'

export type PaymentSource = 'admin' | 'patient' | 'line'

export interface StaffInput {
  id?: bigint
  firstName?: string
  lastName?: string
  firstNameFurigana?: string
  lastNameFurigana?: string
  type?: string
  position?: string
  email?: string
  meetId?: string
  medicalLicenseNumber?: string
  medicalRegistrationNumber?: string
  clinicId: bigint
}

export interface PatientInput {
  id?: number
  firstName?: string
  lastName?: string
  firstNameFurigana?: string
  lastNameFurigana?: string
  email?: string
  birthYear?: string
  gender?: number
  phone?: string
  memberId?: string
  customerId?: string
  clinicNumber?: string
  cancelCount?: number
  lateCount?: number
}

export interface SessionProps {
  session: Session | null
}

export interface ProductInput {
  id?: number
  productName?: string
  category?: string
  price?: number
  note?: string
  sort?: number
}

export interface ReceptionInput {
  id: number
  title: string
  complaint: string
  treatment: string
  prescription: string
}

export interface ReceptionFormInput {
  examinationId: number
  doctorId: number
  phone: string
  appointmentTime: string
  firstName: string
  lastName: string
  firstNameFurigana: string
  lastNameFurigana: string
  patientId: number
  appointmentDate: string
  memo: string
  birthDay: string
}
