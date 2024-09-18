import type { Doctor } from '@/gen/proto/v1/reception_pb'
import { getScheduleReception } from '@/server/reception'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  handleUpdateDoctor: (receptionId: bigint, doctorId: number) => Promise<void>
  receptionId: bigint
  menuId?: number
}

export default function UpdateDoctorPopup({
  handleUpdateDoctor,
  receptionId,
  menuId,
}: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await getScheduleReception(menuId)
      setDoctors(response.doctors)
    }

    fetchDoctors()
  }, [menuId])

  const renderDoctors = useMemo(() => {
    return doctors.map((doctor) => (
      <div
        key={doctor.id}
        className="flex cursor-pointer items-center gap-2 px-1 text-[14px] font-medium hover:bg-primary-client"
        onClick={() => handleUpdateDoctor(receptionId, doctor.id)}
      >
        {doctor.name}
      </div>
    ))
  }, [doctors, handleUpdateDoctor, receptionId])

  return (
    <div className="w-40 rounded-md border bg-primary-admin p-2">
      <div className="mt-1 flex w-full flex-col gap-1">{renderDoctors}</div>
    </div>
  )
}
