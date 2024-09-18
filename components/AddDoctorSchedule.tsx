'use client'

import type { Doctor } from '@/gen/proto/v1/reception_pb'
import { getScheduleReception } from '@/server/reception'
import type { ReceptionFormInput } from '@/utils/type'
import React, { useEffect, useState } from 'react'
import type { UseFormRegister } from 'react-hook-form'

type DoctorSelectProps = {
  onSelect: (doctor: Doctor | undefined) => void
  styleSelect: string
  menuId?: number
  doctor?: Doctor
  register: UseFormRegister<ReceptionFormInput>
}

const AddDoctorSchedule: React.FC<DoctorSelectProps> = ({
  onSelect,
  styleSelect,
  menuId,
  doctor,
  register,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedDoctorId, setSelectedDoctorId] = useState<number>()

  const fetchDoctorsByMenuID = async () => {
    setLoading(true)
    try {
      const response = await getScheduleReception(menuId)
      setDoctors(response.doctors)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (menuId) {
      fetchDoctorsByMenuID()
    } else if (doctor) {
      setDoctors([doctor])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuId, doctor])

  useEffect(() => {
    setSelectedDoctorId(doctor?.id || 0)
  }, [doctor])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = Number(e.target.value)
    setSelectedDoctorId(doctorId)
    const selectedDoctor = doctors.find((doc) => doc.id === doctorId)
    onSelect(selectedDoctor)
    register('doctorId').onChange(e)
  }

  return (
    <div className="">
      <select
        className={`${styleSelect} rounded border p-2 text-center`}
        //defaultValue={0}
        // name="doctorId"
        {...register('doctorId')}
        defaultValue={selectedDoctorId}
        onChange={handleSelectChange}
      >
        <option value="">-------</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
        {loading && <option className="text-center">...</option>}
      </select>
    </div>
  )
}

export default AddDoctorSchedule
