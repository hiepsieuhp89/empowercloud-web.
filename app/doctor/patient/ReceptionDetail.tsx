'use client'
import Camera from '@/components/Camera'
import CommonModal from '@/components/CommonModal'
import type { Reception } from '@/gen/proto/v1/reception_pb'
import { sendMessageToLineUser } from '@/server/chat'
import {
  patientReceptionList,
  receptionDetail,
  storeReception,
  updateReception,
} from '@/server/reception'
import { convertStatusToClass, convertStatusToText } from '@/utils/reception'
import type { ReceptionInput } from '@/utils/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const basicFormSchema = z.object({
  id: z.union([z.number(), z.null(), z.string(), z.string().length(0)]),
  title: z.string(),
  complaint: z.string(),
  treatment: z.string(),
  prescription: z.string(),
})

const PatientReceptionDetail: React.FC = () => {
  const { handleSubmit, register, reset } = useForm<ReceptionInput>({
    resolver: zodResolver(basicFormSchema),
  })

  const role = 'admin'
  const params = useSearchParams()

  const [showTemplateModal, setShowTemplateModal] = useState(false)
  //const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const receiptParam = params.get('id') ?? ''
  const patientId = params.get('pid') ?? ''

  const router = useRouter()

  const [lasReception, setLastReception] = useState<Reception>()
  // const patient = PatientRecord.fromJson(patientDumy())

  const [showCamera, setShowCamera] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        if (receiptParam) {
          const reception = (await receptionDetail(
            Number(receiptParam),
          )) as Reception
          reset()
          setLastReception(reception)
        } else if (patientId) {
          const response = await patientReceptionList(Number(patientId))
          reset()
          setLastReception(response[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrorMessage('患者情報が見つかりません')
        setModalIsOpen(true)
      }
    }

    // Call fetchData when component mounts
    fetchData()
  }, [receiptParam, patientId, reset])

  const closeModal = useCallback(() => {
    setModalIsOpen(false)
    setErrorMessage('')
  }, [setModalIsOpen, setErrorMessage])

  const startInterview = useCallback(
    (id: number | undefined) => {
      router.push(`/interview/preparation?role=${role}&iv=${id}`)
    },
    [router],
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)])
    }
  }

  const handleImageClick = (src: string) => {
    setSelectedImage(src)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  const onSubmit: SubmitHandler<ReceptionInput> = async (
    data: ReceptionInput,
  ) => {
    try {
      data.id = Number(lasReception?.id)
      await storeReception(data)
    } catch (err) {}
  }

  const cancelReception = useCallback(async () => {
    if (lasReception) {
      await updateReception(lasReception?.id, 10)
      window.location.reload()
    }
  }, [lasReception])

  const completeReception = useCallback(async () => {
    if (lasReception) {
      const newReceipt = await updateReception(lasReception?.id, 5)
      const lineId = newReceipt?.patient?.lineId
      if (lineId) {
        await sendMessageToLineUser(
          lineId,
          Number(newReceipt.id),
          Number(newReceipt.clinicId),
          Number(newReceipt?.patient?.id),
        )
      }

      window.location.reload()
    }
  }, [lasReception])

  return (
    lasReception && (
      <div className="block w-full justify-center text-black">
        <div className="flex w-full py-4">
          <div className="ml-4">
            <button
              className={`${convertStatusToClass(lasReception?.status ?? 0)} mx-auto w-24 rounded px-4 py-1.5 font-bold text-white`}
            >
              {convertStatusToText(lasReception?.status ?? 0)}
            </button>
          </div>
          <div className="ml-4 block">
            <div className="flex">
              <p>[予約日時] {lasReception?.appointmentTime}</p>
            </div>
            <div className="flex">
              <p>対面診察： {lasReception?.doctor?.name}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </div>
          </div>

          <div className="mx-auto"></div>
          {/* <div>
          <button
            className="mr-4 w-64 rounded border bg-main-500 px-4 py-2 text-white"
            onClick={() => startAISimulation(patient.id)}
          >
            AIシミュレーター
          </button>
        </div> */}
        </div>

        <div className="my-4 flex">
          <div className="mx-auto"></div>
          <div>
            <button
              className="mr-4 w-64 rounded border bg-main-500 px-4 py-2 text-white hover:bg-blue-400"
              onClick={() => startInterview(Number(lasReception?.id))}
            >
              オンライン診察開始
            </button>
          </div>
        </div>

        <div className="block w-full">
          <div className="border-white-100 flex w-full border-0 bg-main-50 pt-2 font-medium">
            <div className={`h-full' mx-4 max-w-[250px] bg-white px-4`}>
              <a
                href="#"
                className="w-full rounded border-0 p-0 py-2 text-black hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
              >
                <p>{lasReception.title || '診察'}</p>
              </a>
            </div>

            {/* <div className="flex max-w-[250px] items-center">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div> */}

            <div className="mx-auto"></div>
            <div className="flex">
              {/* <button
              className="font-base my-2 mr-4 flex items-center rounded border-2 border-main-200 bg-white px-4 hover:bg-blue-400"
              onClick={() => {}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mx-auto size-4 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              テンプレ保存
            </button>
            <button
              className="font-base my-2 mr-4 flex items-center rounded border-2 border-main-200 bg-primary-admin px-4 hover:bg-blue-400"
              onClick={() => setShowTemplateModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mx-auto size-4 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              テンプレ適用
            </button> */}
              {showTemplateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="rounded-md bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-bold">
                        自動入力テンプレートを選択してください
                      </h2>
                      <button
                        className="ml-4 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowTemplateModal(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <ul className="space-y-2">
                      <li
                        className="cursor-pointer rounded p-2 transition duration-200 hover:bg-blue-100 hover:text-blue-100"
                        onClick={() => {
                          //setSelectedTemplate('脱毛')
                          setShowTemplateModal(false)
                        }}
                      >
                        <span className="text-black">脱毛</span>
                      </li>
                      <li
                        className="cursor-pointer rounded p-2 transition duration-200 hover:bg-blue-100 hover:text-blue-100"
                        onClick={() => {
                          //setSelectedTemplate('美肌コース消化')
                          setShowTemplateModal(false)
                        }}
                      >
                        <span className="text-black">美肌コース消化</span>
                      </li>
                      <li
                        className="cursor-pointer rounded p-2 transition duration-200 hover:bg-blue-100 hover:text-blue-100"
                        onClick={() => {
                          //setSelectedTemplate('アートメイク')
                          setShowTemplateModal(false)
                        }}
                      >
                        <span className="text-black">アートメイク</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex size-full">
              <input
                type="hidden"
                {...register('id')}
                value={Number(lasReception.id)}
              />
              <div className="m-2 block h-full w-1/2">
                {/* タイトルと主訴・所見の入力フォーム */}
                <label className="w-full">タイトル</label>
                <textarea
                  className="w-full rounded border bg-main-50 p-4"
                  {...register('title')}
                  defaultValue={lasReception ? lasReception.title : ''}
                  rows={1}
                  cols={30}
                ></textarea>
                <label className="w-full">主訴・所見</label>
                <textarea
                  className="h-36 w-full rounded border bg-main-50 p-4" // 縦幅を半分に
                  {...register('complaint')}
                  defaultValue={lasReception?.id ? lasReception.complaint : ''}
                  rows={7} // rowsも変更
                  cols={30}
                ></textarea>
                {/* 画像追加 */}
                <div className="my-4 flex items-center ">
                  <label className="mr-4 w-auto">画像</label>
                  <label className="font-base flex cursor-pointer items-center rounded border-2 border-main-200 bg-white px-4 hover:bg-blue-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="mx-auto size-4 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span className="ml-2 ">画像追加</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                {/* 画像リスト */}
                <div className="max-h-80vh mt-4 flex flex-col gap-4 overflow-y-auto">
                  <div className="max-h-[calc(100vh - 500px)] mt-4 flex flex-wrap gap-4 overflow-y-auto">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Image ${index}`}
                        className="size-24 cursor-pointer rounded border border-gray-300 object-cover"
                        onClick={() =>
                          handleImageClick(URL.createObjectURL(image))
                        }
                      />
                    ))}
                  </div>
                </div>
                {/* 拡大表示モーダル */}
                {selectedImage && (
                  <div
                    className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black/50"
                    onClick={handleCloseModal}
                  >
                    <div
                      className="max-h-full max-w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* 画像の拡大表示内容 */}
                    </div>
                  </div>
                )}
              </div>

              <div className="block h-full w-1/2 px-4 py-2">
                {/* 処置と処方の入力フォーム */}
                <label className="m-2 w-full">処置</label>
                <textarea
                  className="w-full rounded border bg-main-50 p-4"
                  {...register('treatment')}
                  defaultValue={lasReception?.id ? lasReception.treatment : ''}
                  rows={8}
                  cols={30}
                ></textarea>
                {/* <input className="m-2 h-52 w-full rounded-2xl bg-main-50 p-4 py-2" /> */}
                <label className="m-2 w-full">処方</label>
                <textarea
                  className="w-full rounded border bg-main-50 p-4"
                  rows={8}
                  {...register('prescription')}
                  defaultValue={
                    lasReception?.id ? lasReception.prescription : ''
                  }
                  cols={30}
                ></textarea>
                {/* <input className="m-2 h-52 w-full rounded-2xl bg-main-50 p-4 py-2" /> */}
              </div>
            </div>

            <div className="my-2 flex size-full">
              <div className="mx-auto"></div>
              <button
                className="mx-4 rounded bg-gray-200 px-4 py-1.5 font-bold text-black hover:bg-gray-400"
                type="button"
                onClick={cancelReception}
              >
                診察をキャンセル
              </button>

              <button
                className="mx-4 rounded bg-gray-200 px-4 py-1.5 font-bold text-black hover:bg-blue-200"
                type="submit"
              >
                保存
              </button>

              <button
                className="mx-4 rounded bg-main-200 px-4 py-1.5 font-bold text-white hover:bg-blue-400"
                type="button"
                onClick={completeReception}
              >
                診察完了
              </button>
            </div>
          </form>
        </div>
        {showCamera && <Camera setOpenDialog={setShowCamera} />}

        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative">
              <img src={selectedImage} alt="Selected" className="w-[500px]" />
              <button
                className="absolute right-2 top-2 text-2xl text-white"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
          </div>
        )}
        <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
          <div>{errorMessage}</div>
        </CommonModal>
      </div>
    )
  )
}

export default PatientReceptionDetail
