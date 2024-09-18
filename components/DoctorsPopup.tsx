'use client'

import type { Doctor } from '@/gen/proto/v1/reception_pb'
import { getDoctorList } from '@/server/doctor'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type DoctorSelectProps = {
  onSelect: (doctor: Doctor | undefined) => void
  styleSelect: string
  menuId?: number
  clinnicId: number
}

const DoctorSelect: React.FC<DoctorSelectProps> = ({
  onSelect,
  styleSelect,
  clinnicId,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(0)

  const lastDoctorElementRef = useCallback(
    (node: HTMLOptionElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const response = await getDoctorList({
        clinnicId,
        keyword: '',
        page,
        size: 100,
      })
      const newDoctors = JSON.parse(JSON.stringify(response.doctors))
      setDoctors((prevDoctors) => {
        const updatedDoctors = Array.from(
          new Set([...prevDoctors, ...newDoctors].map((d) => d.id)),
        ).map((id) => [...prevDoctors, ...newDoctors].find((d) => d.id === id)!)
        return updatedDoctors
      })
      setHasMore(newDoctors.length > 0)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = Number(e.target.value)

    setSelectedDoctorId(doctorId)
    const selectedDoctor = doctors.find((doc) => doc.id === doctorId)
    if (selectedDoctor) {
      onSelect(selectedDoctor)
    } else {
      onSelect(undefined)
    }
  }

  return (
    <div className="">
      <select
        className={`${styleSelect} rounded border p-2 text-center`}
        onChange={handleSelectChange}
        defaultValue={0}
        value={selectedDoctorId}
      >
        <option value={0} key={0}>
          -------
        </option>
        {doctors.map((doctor, index) => (
          <option
            key={doctor.id}
            value={doctor.id}
            ref={index === doctors.length - 1 ? lastDoctorElementRef : null}
          >
            {doctor.name}
          </option>
        ))}
        {loading && <option className="text-center">...</option>}
      </select>
    </div>
  )
}

export default DoctorSelect
