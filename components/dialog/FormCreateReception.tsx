import type { Doctor } from '@/gen/proto/v1/reception_pb'
import type { CreateReceptionParams } from '@/server/reception'
import { createReception, getScheduleReception } from '@/server/reception'
//import { examinations } from '@/utils/reception'
import type { MenuItem } from '@/gen/proto/v1/menu_pb'
import { listMenu } from '@/server/menu'
import type { ReceptionFormInput } from '@/utils/type'
import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays } from 'date-fns'
import { useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import AddDoctorSchedule from '../AddDoctorSchedule'
import MenuSelect from '../SelectMenu'

interface FromCreateReceptionProps {
  handleBack: () => void
  patientFirstName: string
  patientLastName: string
  patientFirstNameFurigana: string
  patientLastNameFurigana: string
  patientBirthDate: string
  patientTel: string
  patientId: number
  patientMenuId: number
  patientSelectedDate: string
  patientSelectedTime: string
  patientMemo: string
  receptionId?: number
  doctor?: Doctor
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const basicFormSchema = z.object({
  examinationId: z
    .string()
    .min(1, { message: '診察メニューを選択してください' })
    .nonempty({ message: '診察メニューを選択してください' }),
  doctorId: z.string().min(1, '医師を選択してください'),
  phone: z.union([z.string(), z.string().length(0)]),
  appointmentTime: z.string().min(1, '予約日時を選択してください'),
  firstName: z.string().min(1, '姓名を入力してください'),
  lastName: z.union([z.string(), z.string().length(0)]),
  firstNameFurigana: z.string().min(1, 'セイを入力してください'),
  lastNameFurigana: z.union([z.string(), z.string().length(0)]),
  // patientId: z.union([z.number(), z.string()]),
  appointmentDate: z.union([z.string(), z.string().length(0)]),
  memo: z.union([z.string(), z.string().length(0)]),
  birthDay: z.union([z.string(), z.string().length(0)]),
})

const FormCreateReception: React.FC<FromCreateReceptionProps> = ({
  handleBack,
  patientFirstName,
  patientLastName,
  patientFirstNameFurigana,
  patientLastNameFurigana,
  patientBirthDate,
  setOpenDialog,
  patientTel,
  patientId,
  patientMenuId,
  patientSelectedDate,
  patientSelectedTime,
  patientMemo,
  receptionId,
  doctor,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [menuId, setMenuId] = useState(String(patientMenuId))
  const [selectedDate, setSelectedDate] = useState<string>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [allMenus, setAllMenus] = useState<MenuItem[]>([])
  const [validMenus, setValidMenus] = useState<MenuItem[]>([])

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ReceptionFormInput>({
    resolver: zodResolver(basicFormSchema),
  })

  const handleSelectDoctor = (doctor: Doctor | undefined) => {
    setSelectedDoctor(doctor)
  }

  useEffect(() => {
    const fetchExamData = async () => {
      const menuItems = await listMenu()
      setAllMenus(menuItems.items)
      setValidMenus(menuItems.items)
    }

    fetchExamData()
  }, [])

  useEffect(() => {
    if (patientSelectedDate) {
      setAvailableDates([patientSelectedDate])
      setSelectedDate(patientSelectedDate)
    }
  }, [patientSelectedDate, setSelectedDate, setAvailableDates])

  useEffect(() => {
    if (patientSelectedTime) {
      setAvailableTimes([patientSelectedTime])
      setSelectedTime(patientSelectedTime)
    }
  }, [patientSelectedTime, setSelectedTime, setAvailableTimes])

  const onSubmit: SubmitHandler<ReceptionFormInput> = async (
    data: ReceptionFormInput,
  ) => {
    try {
      const params: CreateReceptionParams = {
        examinationId: Number(data.examinationId),
        doctorId: Number(data.doctorId),
        phoneNumber: `${data.phone}`,
        appointmentTime: `${data.appointmentDate}T${data.appointmentTime}`,
        firstName: `${data.firstName}`,
        lastName: `${data.lastName}`,
        firstNameFurigana: `${data.firstNameFurigana}`,
        lastNameFurigana: `${data.lastNameFurigana}`,
        birthDate: `${data.birthDay}`,
        patientId: patientId ? patientId : 0,
      }

      if (data.memo) {
        params.memoContent = `${data.memo}`
      }
      await createReception(params)
      reset()
      setOpenDialog(false)
    } catch (err) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (doctor) {
      setSelectedDoctor(doctor)
    }
  }, [doctor])

  useEffect(() => {
    const fetchAvailableDates = async () => {
      setIsLoading(true)
      try {
        const response = await getScheduleReception(
          undefined,
          selectedDoctor?.id,
        )
        setAvailableDates(response.dates)
      } catch (error) {
        setAvailableDates([])
      }
      setIsLoading(false)
    }

    if (selectedDoctor) {
      fetchAvailableDates()
      const doctorMenus = allMenus.filter((i) =>
        i.doctorIds.includes(selectedDoctor.id),
      )
      setValidMenus(doctorMenus)
    } else {
      setValidMenus(allMenus)
    }
  }, [selectedDoctor, allMenus, setValidMenus])

  useEffect(() => {
    const fetchAvailableTime = async () => {
      setIsLoading(true)
      try {
        const response = await getScheduleReception(
          Number(menuId),
          selectedDoctor?.id,
          selectedDate,
          addDays(new Date(selectedDate ?? ''), 1)
            .toISOString()
            .split('T')[0],
        )
        setAvailableTimes(response.scheduleTime)
      } catch (error) {
        setAvailableTimes([])
      }
      setIsLoading(false)
    }

    if (selectedDate && selectedDoctor?.id) {
      fetchAvailableTime()
    }
  }, [selectedDate, selectedDoctor?.id, menuId])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="block">
      {isLoading && (
        <div className="absolute left-0 top-0 z-40 flex size-full items-center justify-center bg-gray-900/50">
          <div className="size-20 animate-spin rounded-full border-y-2 border-white"></div>
        </div>
      )}
      <input type="hidden" value={patientId} name="patient_id" />
      <div className="flex w-full px-16">
        <h1 className="mx-auto pb-2 text-xl font-bold">
          {' '}
          {receptionId ? '予約編集' : '新規予約'}
        </h1>
      </div>
      <div className="mt-2  flex  w-full px-16">
        <div className="mt-2 block w-1/2  pr-16">
          <label className="w-full py-2">姓</label>
          <input
            className="w-full rounded p-2"
            {...register('firstName')}
            readOnly={!!patientId}
            defaultValue={patientFirstName}
          />
          <ErrorMessage
            errors={errors}
            name="firstName"
            as="p"
            className="text-red-500"
          />
        </div>
        <div className="mt-2 block w-1/2  pl-16">
          <label className="w-full py-2">名</label>
          <input
            className="w-full rounded p-2"
            {...register('lastName')}
            readOnly={!!patientId}
            defaultValue={patientLastName}
          />
          <ErrorMessage
            errors={errors}
            name="lastName"
            as="p"
            className="text-red-500"
          />
        </div>
      </div>
      <div className="mt-2 flex  w-full px-16">
        <div className="mt-2 block w-1/2  pr-16">
          <label className="w-full py-2">セイ</label>
          <input
            className="w-full rounded p-2"
            {...register('firstNameFurigana')}
            readOnly={!!patientId}
            defaultValue={patientFirstNameFurigana}
          />
          <ErrorMessage
            errors={errors}
            name="firstNameFurigana"
            as="p"
            className="text-red-500"
          />
        </div>
        <div className="mt-2 block w-1/2  pl-16">
          <label className="w-full py-2">メイ</label>
          <input
            className="w-full rounded p-2"
            {...register('lastNameFurigana')}
            readOnly={!!patientId}
            defaultValue={patientLastNameFurigana}
          />
          <ErrorMessage
            errors={errors}
            name="lastNameFurigana"
            as="p"
            className="text-red-500"
          />
        </div>
      </div>
      <div className="mt-2 flex  w-full px-16">
        <div className="block w-1/2 pr-16">
          <label className="w-full py-2">生年月日</label>
          <input
            className="w-full rounded p-2"
            type="date"
            {...register('birthDay')}
            readOnly={!!patientId}
            defaultValue={patientBirthDate}
          />
          <ErrorMessage
            errors={errors}
            name="birthDay"
            as="p"
            className="text-red-500"
          />
        </div>
        <div className="mt-2 block w-1/2  pl-16">
          <label className="w-full py-2">電話番号</label>
          <input
            className="w-full rounded p-2"
            {...register('phone')}
            readOnly={!!patientId}
            defaultValue={patientTel}
          />
          <ErrorMessage
            errors={errors}
            name="phone"
            as="p"
            className="text-red-500"
          />
        </div>
      </div>

      <div className="mt-2 block w-full rounded px-16">
        <label className="w-full py-2">診察メニュー</label>
        <MenuSelect
          menuId={menuId}
          setMenuId={setMenuId}
          defaultMenuId={String(patientMenuId)}
          validMenus={validMenus}
          register={register}
        />
        <ErrorMessage
          errors={errors}
          name="examinationId"
          as="p"
          className="text-red-500"
        />
      </div>

      <div className="mt-2 flex  w-full px-16">
        <div className="mt-2 flex  w-1/2 flex-wrap pr-16">
          <label className="w-full py-2">希望担当医師</label>
          <div className="mx-auto w-full">
            <AddDoctorSchedule
              onSelect={handleSelectDoctor}
              styleSelect="w-full !rounded"
              menuId={Number(menuId)}
              doctor={doctor}
              register={register}
            />
            <ErrorMessage
              errors={errors}
              name="doctorId"
              as="p"
              className="text-red-500"
            />
          </div>
        </div>
        <div className="mt-2 flex  w-1/2 flex-wrap pl-16">
          <label className="w-full py-2">予約日時</label>
          <div className="w-1/2">
            <select
              {...register('appointmentDate')}
              className={`w-full rounded border p-2 text-center ${patientSelectedDate && !availableDates.includes(patientSelectedDate) ? 'text-red-500' : ''}`}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                register('appointmentDate').onChange(e)
              }}
              value={selectedDate || patientSelectedDate}
            >
              <option value="">-----</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
              {!availableDates.includes(patientSelectedDate) && (
                <option value={patientSelectedDate}>
                  {patientSelectedDate}
                </option>
              )}
            </select>
          </div>
          <div className="w-1/2  pl-4">
            <select
              {...register('appointmentTime')}
              className={`w-full rounded border p-2 text-center ${patientSelectedTime && !availableTimes.includes(patientSelectedTime) ? 'text-red-500' : ''}`}
              value={selectedTime || patientSelectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value)
                register('appointmentTime').onChange(e)
              }}
            >
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
              {!availableTimes.includes(patientSelectedTime) && (
                <option value={patientSelectedTime}>
                  {patientSelectedTime}
                </option>
              )}
            </select>
          </div>
          <ErrorMessage
            errors={errors}
            name="appointmentTime"
            as="p"
            className="text-red-500"
          />
        </div>
      </div>

      <div className="mt-2 block w-full  px-16">
        <label className="w-full py-2">メモ</label>
        <textarea
          className="w-full rounded p-2"
          {...register('memo')}
          defaultValue={patientMemo}
        />
      </div>
      <div className="mt-4 flex w-full px-16">
        <button
          className="mr-8 w-32  rounded border-2 border-main-500 bg-white p-2 hover:bg-gray-400 hover:text-white"
          onClick={() => handleBack()}
          type="button"
        >
          戻る
        </button>
        <button
          className="ml-8 w-32  rounded border-2 border-main-500 bg-main-400 p-2 hover:bg-blue-500 hover:text-white"
          type="submit"
        >
          予約
        </button>
      </div>
    </form>
  )
}

export default FormCreateReception
