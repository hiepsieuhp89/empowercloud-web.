'use client'

import type { Doctor } from '@/gen/proto/v1/reception_pb'
import React from 'react'
import Modal from 'react-modal'

type DoctorSelectProps = {
  onSelect: () => void
  doctors: Doctor[]
  styleSelect: string
  isOpen: boolean
  onClose: () => void
  selectedDoctorIds: number[]
  setSelectedDoctorIds: React.Dispatch<React.SetStateAction<number[]>>
}

const MultiDoctorSelection: React.FC<DoctorSelectProps> = ({
  onSelect,
  doctors,
  isOpen,
  onClose,
  selectedDoctorIds,
  setSelectedDoctorIds,
}) => {
  // const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedValues = Array.from(e.target.selectedOptions, (option) =>
  //     Number(option.value),
  //   )

  //   setSelectedDoctorIds(selectedValues)
  // }
  if (!isOpen) return null

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10)
    setSelectedDoctorIds((prevSelectedIds) =>
      event.target.checked
        ? [...prevSelectedIds, value]
        : prevSelectedIds.filter((id) => id !== value),
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Example Modal"
      overlayClassName="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
      className="relative max-h-full max-w-3xl overflow-auto rounded-lg bg-white text-black"
    >
      <button
        onClick={onClose}
        className="absolute right-0 top-0 flex size-6 items-center text-4xl text-red-500"
      >
        &times;
      </button>
      <div className="size-full p-8">
        <div className="relative">
          <label className="w-full font-bold">担当を選択してください</label>
          <div className="flex flex-col">
            {doctors.map((doctor) => (
              <label key={doctor.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={doctor.id}
                  checked={selectedDoctorIds.includes(doctor.id)}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {doctor.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="size-full p-8">
        <div className="relative">
          <label className="w-full font-bold">医師を選択ください</label>
          <select
            className={`w-full ${styleSelect}`}
            onChange={handleSelectChange}
            value={selectedDoctorIds.map((i) => i.toString())}
            multiple={true}
          >
            <option value={0}>-------</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
      </div> */}
      <div className="my-4 flex w-full">
        <button
          onClick={onSelect}
          className="mx-auto rounded bg-main-200 px-4 py-1.5 font-bold text-white hover:bg-blue-400"
        >
          OK
        </button>
      </div>
    </Modal>

    // </div>
  )
}

export default MultiDoctorSelection
