'use client'

import { getListFilesOfPatient } from '@/server/chat'
import { detailPatient } from '@/server/patient'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DocumentDownloadDialogComponent from './DownloadDialog'

interface FileData {
  name: string
  url: string
  date?: string
}

const PatientDocumentComponent: React.FC = () => {
  const [isShowDialog, setIsShowDialog] = useState(false)
  const [documentType, setDocumentType] = useState('')
  const params = useSearchParams()
  const patientId = params.get('pid') ?? ''
  const receptionId = params.get('id') ?? ''
  const [fileData, setFileData] = useState<FileData[]>([])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      const response = await detailPatient(Number(patientId))
      const res = await getListFilesOfPatient(String(response?.id))
      setFileData(res)
    }

    // Call fetchData when component mounts
    fetchData()
  }, [patientId])

  const DOCUMENT_TYPES = [
    '紹介・情報提供書',
    // '医師意見書',
    // '特別訪問看護指示書',
    // '経過報告書',
    // '訪問看護指示書',
    // '診断書',
    // '診察に関する説明と承諾書',
    // '診療情報提供書様式',
    // '診療情報提供書様式 その2',
    // '説明書',
  ]

  const opendDownloadLink = (link: string) => {
    window.open(link, '_blank')
  }

  const downloadIntroductionFile = async () => {
    try {
      // Send a POST request to the API route
      const response = await fetch(`/api/export/document`, {
        method: 'POST',
        body: JSON.stringify({
          receptionId,
        }),
      })

      // Check if the request was successful
      if (response.ok) {
        // Convert the response to a blob
        const blob = await response.blob()

        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob)

        // Create a link element
        const link = document.createElement('a')
        link.href = url
        link.download = '紹介・情報提供書.pdf'

        // Simulate a click on the link to trigger the download
        document.body.appendChild(link)
        link.click()

        // Clean up
        URL.revokeObjectURL(url)
        document.body.removeChild(link)
      } else {
        console.error('Failed to download file')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  return (
    <div className="justify-center text-black">
      <div className="flex">
        <button className="border-b-4 border-main-200 px-4 pt-2 font-bold text-black">
          院内共有
        </button>
        <div className="mx-auto" />

        <div className="my-2 flex items-center justify-center rounded border p-2">
          <p className="items-center justify-center">文書雛形</p>
          <div className="group relative">
            <button className="">
              <svg
                width="10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="sm:size-4 md:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <div className="z-9000 absolute right-0 top-4 hidden w-64 overflow-scroll bg-white py-4 group-hover:block">
              <div className="w-full rounded-2xl border">
                {DOCUMENT_TYPES.map((type, _i) => (
                  <button
                    key={_i}
                    className="my-2 flex w-full border bg-main-100 py-2"
                    onClick={() => {
                      downloadIntroductionFile()
                      //setIsShowDialog(true)
                      setDocumentType(type)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <table className="w-full">
          <thead>
            <tr className="bg-main-50">
              <th>アップロード時間</th>
              <th>ファイル名</th>
            </tr>
          </thead>
          <tbody>
            {fileData.map((item, index) => (
              <tr
                key={index}
                className="cursor-pointer border-b"
                onClick={() => opendDownloadLink(item.url)}
              >
                <td className="border-b text-center">
                  {format(new Date(item?.date || ''), 'yyyy-MM-dd HH:mm')}
                </td>
                <td className="border-b text-center">
                  <div className="mx-4 flex">
                    <button className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                    </button>
                    <div className="block text-left">
                      <p>{item.name}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocumentDownloadDialogComponent
        id={documentType}
        setShowDialog={setIsShowDialog}
        onClickFunction={() => {}}
        showDialog={isShowDialog}
      />
    </div>
  )
}

export default PatientDocumentComponent
