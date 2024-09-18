// components/ChatRoom.tsx
import type { Patient } from '@/gen/proto/v1/patient_pb'
import type { Message } from '@/server/chat'
import {
  generatePresignedUploadLink,
  getMessages,
  sendMessage,
} from '@/server/chat'
import { format } from 'date-fns'
import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import CommonModal from '../CommonModal'

interface ChatRoomProps {
  roomId: string
  role: string
  patient: Patient | undefined
}

const ChatComponent = ({ roomId, role, patient }: ChatRoomProps) => {
  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSendMessage()
  //   }
  // }

  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const lastItemRef = useRef<HTMLDivElement | null>(null)
  const [selectedType, setSelectedType] = useState<string>('image')

  const [autoScroll, setAutoScroll] = useState(true)

  const observerRef = useRef<IntersectionObserver | null>(null)
  // const [isLastItemVisible, setIsLastItemVisible] = useState(false)

  const scrollToLastItem = useCallback(() => {
    if (lastItemRef.current && autoScroll) {
      lastItemRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [lastItemRef, autoScroll])

  const openModal = (image: string, fileType: string) => {
    setSelectedType(fileType)
    setSelectedImage(image)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedImage(null)
  }

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [fileNames, setFileNames] = useState<string[]>([])
  const [fileDataUrls, setFileDataUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getMessagesList = useCallback(async () => {
    const items = await getMessages({ roomId, role })
    items.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    setMessages(items)
    setTimeout(() => {
      scrollToLastItem()
    }, 200)
  }, [roomId, role, setMessages, scrollToLastItem])

  useEffect(() => {
    const interval = setInterval(() => {
      getMessagesList()
    }, 10000)

    getMessagesList()
    return () => clearInterval(interval)
  }, [roomId, getMessagesList])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setAutoScroll(entry.isIntersecting)
      },
      {
        root: null, // or you can set a specific scrolling container
        threshold: 1.0, // when the last item is fully visible
      },
    )

    if (lastItemRef.current) {
      observerRef.current.observe(lastItemRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    setIsLoading(true)
    if (newMessage.trim() || fileNames.length > 0) {
      await sendMessage(newMessage, roomId, role, fileDataUrls, fileNames)
      setIsLoading(false)
      setNewMessage('')
      setFileNames([])
      setFileDataUrls([])
      setAutoScroll(true)
      await getMessagesList()
    }
  }

  const removeFile = (index: number) => {
    setFileNames((prev) => prev.filter((_, i) => i !== index))
    setFileDataUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 5) {
      alert('ファイルは5個まで選択してください。')
      return
    }
    setIsLoading(true)
    for (const file of files) {
      const fName = `${patient?.id}/${Date.now()}/${file.name}`
      const url = await generatePresignedUploadLink(fName)
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })
      setFileDataUrls((prev) => [...prev, fName])
      setFileNames((prev) => [...prev, file.name])
    }
    setIsLoading(false)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  function isImageFileName(fileName: string) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg']

    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'))

    return imageExtensions.includes(extension)
  }

  const isVideoFile = (fileName: string): boolean => {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mkv', 'mov']
    const extension = fileName.split('.').pop()?.toLowerCase()
    return videoExtensions.includes(extension || '')
  }

  return (
    <div className="relative block size-full py-2">
      {isLoading && (
        <div className="absolute left-0 top-0 z-40 flex size-full items-center justify-center bg-gray-900/50">
          <div className="size-20 animate-spin rounded-full border-y-2 border-white"></div>
        </div>
      )}
      <div className="h-90p overflow-scroll">
        {messages.map((message, _i) => (
          <div
            ref={_i === messages.length - 1 ? lastItemRef : null}
            key={`message_${_i}_${message.createdAt.getTime()}`}
            className="my-2"
          >
            <div className="mb-2 px-4">
              {message.text && (
                <div
                  className={`block w-full ${message.from == role ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block rounded-xl text-left ${message.from == 'admin' ? 'bg-white' : 'bg-gray-300'}  whitespace-pre-wrap p-2`}
                  >
                    {message.text}
                  </div>
                </div>
              )}

              {message.fileNames &&
                message.fileNames.length > 0 &&
                message.fileUrls &&
                message.fileUrls.map((fileUrl, _k) => (
                  <div
                    key={`file_${message.id}_${_k}`}
                    className={`mt-2 flex w-full ${message.from == role ? 'justify-end' : 'justify-start'}`}
                  >
                    {isImageFileName(message.fileNames[_k]) && (
                      <img
                        src={fileUrl}
                        alt="Description of the image"
                        className="w-4/6 cursor-pointer"
                        onClick={() => openModal(fileUrl, 'image')}
                      />
                    )}
                    {isVideoFile(message.fileNames[_k]) && (
                      <div className="flex w-4/6 cursor-pointer text-blue-500">
                        <p className="mr-2 w-48 truncate">
                          {message.fileNames[_k]}
                        </p>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            openModal(fileUrl, 'video')
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
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </button>
                        <a
                          href={fileUrl}
                          className="ml-2 cursor-pointer text-blue-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 font-bold"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                    {!isImageFileName(message.fileNames[_k]) &&
                      !isVideoFile(message.fileNames[_k]) && (
                        <a
                          href={fileUrl}
                          className="flex w-4/6 cursor-pointer text-blue-500"
                        >
                          <p className="w-64 truncate">
                            {message.fileNames[_k]}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 font-bold"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                        </a>
                      )}
                  </div>
                ))}
              <div
                className={`block w-full text-sm ${message.from == role ? 'text-right' : 'text-left'}`}
              >
                {format(message.createdAt, 'yyyy-MM-dd HH:mm')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {fileNames.length > 0 && (
        <div className="absolute bottom-12 z-10 flex h-24 w-full flex-col-reverse overflow-x-auto pb-2">
          {fileNames.map((fileName, index) => (
            <div className="inline-block" key={index}>
              <button onClick={() => removeFile(index)} className="flex">
                <p className="w-64 truncate">{fileName}</p>
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="absolute bottom-0 z-10 h-12 w-full pb-2">
        <div className="inline-block h-full w-3/4 px-2">
          <div className="flex size-full justify-end rounded-xl bg-white">
            {/* <input type="text" */}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full resize-none rounded-xl p-2"
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileInputChange}
            />
            <div
              className="rounded-base m-1 inline-block w-8 cursor-pointer items-center justify-center rounded border border-black"
              onClick={handleButtonClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mx-auto size-6 font-bold"
              >
                <path
                  fillRule="evenodd"
                  d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="inline-block h-full w-1/4 px-2">
          <button
            className="size-full rounded-xl bg-gray-400 px-2 text-white"
            onClick={handleSendMessage}
          >
            送信
          </button>
        </div>
      </div>

      <CommonModal isOpen={isOpen} onClose={closeModal}>
        {selectedImage && selectedType == 'image' && (
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-1/2 max-h-1/2"
          />
        )}
        {selectedImage && selectedType == 'video' && (
          <video
            src={selectedImage}
            controls
            width="600"
            className="max-w-1/2 max-h-1/2"
          />
        )}
      </CommonModal>
    </div>
  )
}

export default ChatComponent
