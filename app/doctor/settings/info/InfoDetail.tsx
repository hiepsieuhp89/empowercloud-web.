'use client'
import EditableClinicInput from '@/components/EditableClinicInput'
import type { Clinic } from '@/gen/proto/v1/clinic_pb'
import { clinicList, storeClinic } from '@/server/clinic'
import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import React, { useCallback, useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

interface Props {
  session: Session | null
}

const InfoDetail: React.FC<Props> = ({ session }) => {
  const user = session?.user as SessionUser
  const [clinic, setClinic] = useState<Clinic>()
  const { handleSubmit, watch, register, reset } = useForm<Clinic>({})

  const watchedAnswers = watch()

  const fetchClinic = useCallback(async () => {
    const list = await clinicList('', 1, 30)
    const item = list.clinics.findLast((i) => i.id === user.clinic_id)
    if (item) {
      setClinic(item)
      reset(item)
    }
  }, [user, setClinic, reset])

  useEffect(() => {
    fetchClinic()
  }, [fetchClinic])

  function handleChange(): void {
    console.log('changed')
    // throw new Error('Function not implemented.')
    handleSubmit(onSubmit)()
  }

  // const [image, setImage] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     setImage(event.target.files[0])
  //   }
  // }

  // const handleImageClick = (src: string) => {
  //   setSelectedImage(src)
  // }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  const onSubmit: SubmitHandler<Clinic> = async (data: Clinic) => {
    await storeClinic(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="block">
      <div className="w-full">
        {/* <div className="my-4 flex w-full bg-main-50 p-4 font-bold text-black">
        <select className="w-42 ml-4 rounded py-2 text-center">
          <option>クララ美容皮膚科那覇院</option>
        </select>

        <div className="mx-auto"></div>
      </div> */}

        <div className="my-4 flex w-full text-gray-500">
          <div className="flex w-96 flex-col items-center justify-center">
            {/* 画像リスト */}
            <div className="flex flex-col items-center justify-center">
              {user.clinic_id && (
                <img
                  src={`/clinics/${user.clinic_id}.png`}
                  alt="Uploaded"
                  className="size-64 cursor-pointer rounded border border-gray-300 object-cover"
                />
              )}
            </div>

            {/* 画像追加 */}
            <div className="mt-4 hidden items-center justify-center">
              <label className="font-base flex cursor-pointer items-center rounded border-2 border-main-200 bg-white px-4 hover:bg-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mx-auto size-6 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="ml-2">ロゴ設定</span>
                <input
                  type="file"
                  className="hidden"
                  // onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
          <div className="w-2/3 px-4">
            <h1 className="w-full py-2 text-xl">基本情報</h1>
            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">医療機関名</p>
              <EditableClinicInput
                value={watchedAnswers?.name || ''} // "クララ美容皮膚科那覇院"
                setValue={handleChange}
                register={register}
                inputName="name"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">院長</p>
              <EditableClinicInput
                value={watchedAnswers?.cto || ''} // "仲田力次"
                setValue={handleChange}
                register={register}
                inputName="cto"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">電話番号</p>
              <EditableClinicInput
                value={watchedAnswers?.phone || ''} // "098-996-4444"
                setValue={handleChange}
                register={register}
                inputName="phone"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">ホームページURL</p>
              <EditableClinicInput
                value={watchedAnswers?.storeUrl || ''} // "https://clarabeautyclinic.jp/nahain/"
                setValue={handleChange}
                register={register}
                inputName="storeUrl"
              />
            </div>

            <h1 className="py-2 text-xl">医療機関所在地</h1>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">郵便番号</p>
              <EditableClinicInput
                value={watchedAnswers?.postalCode || ''} //value="〒902-0063"
                setValue={handleChange}
                register={register}
                inputName="postalCode"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">都道府県</p>
              <EditableClinicInput
                value={watchedAnswers?.prefecture || ''} //value="沖縄県"
                setValue={handleChange}
                register={register}
                inputName="prefecture"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">市区町村</p>
              <EditableClinicInput
                value={watchedAnswers?.addressLine1 || ''} //value="那覇市"
                setValue={handleChange}
                register={register}
                inputName="addressLine1"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">番地・ビル名</p>
              <EditableClinicInput
                value={clinic?.addressLine2 || ''} //value="三原1丁目26番1号メゾンみはら1階"
                setValue={handleChange}
                register={register}
                inputName="addressLine2"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">受付時間</p>
              <EditableClinicInput
                value={watchedAnswers?.basicBusinessHours1 || ''} //value="10:00~19:00"
                setValue={handleChange}
                register={register}
                inputName="basicBusinessHours1"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">LINE公式アカウントURL</p>
              <EditableClinicInput
                value={watchedAnswers?.lineUrl || ''} //value="https://page.line.me/513kkyow"
                setValue={handleChange}
                register={register}
                inputName="lineUrl"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">Instagram公式アカウントURL</p>
              <EditableClinicInput
                value={watchedAnswers?.instagramUrl || ''} //value="https://www.instagram.com/clara_okinawa/"
                setValue={handleChange}
                register={register}
                inputName="instagramUrl"
              />
            </div>

            <div className="flex w-full px-4 py-2">
              <p className="w-2/5">Googleレビューリンク</p>
              <EditableClinicInput
                value={watchedAnswers?.googleReviewUrl || ''} //value="https://www.instagram.com/clara_okinawa/"
                setValue={handleChange}
                register={register}
                inputName="googleReviewUrl"
              />
            </div>
          </div>
        </div>

        {/* 拡大表示モーダル */}
        {selectedImage && (
          <div
            className="bg-opacity/50 fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black"
            onClick={handleCloseModal}
          >
            <div
              className="max-h-full max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Selected"
                className="h-auto max-w-full"
              />
            </div>
          </div>
        )}
      </div>
    </form>
  )
}

export default InfoDetail
