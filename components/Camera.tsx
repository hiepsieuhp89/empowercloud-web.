// components/CameraComponent.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react'
import SimulationImage from './SimulationImage'

interface CameraComponentProps {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const CameraComponent: React.FC<CameraComponentProps> = ({ setOpenDialog }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const [isStreaming, setIsStreaming] = useState<boolean>(false)

  const [originalImage, setOriginalImage] = useState<string | null>(
    'http://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_2389-scaled.jpg',
  )

  const [filteredImage, setFilteredImage] = useState<string | null>(null)

  // Function to start video stream
  const startVideoStream = async () => {
    try {
      setIsStreaming(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const stopVideoStream = () => {
    if (videoRef.current) {
      setIsStreaming(false)
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  // Function to take a picture
  const takePicture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        // Draw the current frame from the video onto the canvas
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        )
        // Get the data URL of the captured image
        const dataURL = canvasRef.current.toDataURL('image/png')
        // Set the captured image in the state
        setCapturedImage(dataURL)
        stopVideoStream()
      }
    }
  }

  const cancelCamera = async () => {
    stopVideoStream()
    setOpenDialog(false)
  }

  // Start the video stream when the component mounts
  useEffect(() => {
    const cleanupFunction = () => {
      // Clean up the stream when the component unmounts
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    }

    //startVideoStream()

    return cleanupFunction
  }, [])

  const handleEyeSimulation = useCallback(() => {
    setFilteredImage(
      capturedImage ||
        'http://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_2389-scaled.jpg',
    )
    setOriginalImage(
      'https://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_0490.jpg',
    )
  }, [setOriginalImage, setFilteredImage, capturedImage])

  const handleNoseSimulation = useCallback(() => {
    setFilteredImage(
      capturedImage ||
        'http://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_2350.jpg',
    )
    setOriginalImage(
      'http://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_2375.jpg',
    )
  }, [setOriginalImage, setFilteredImage, capturedImage])

  const handleToothSimulation = useCallback(() => {
    setFilteredImage(
      capturedImage ||
        'http://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_2389-scaled.jpg',
    )
    setOriginalImage(
      'http://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_2432-scaled.jpg',
    )
  }, [setOriginalImage, setFilteredImage, capturedImage])

  const handleMakeUpSimulation = useCallback(() => {
    setFilteredImage(
      capturedImage ||
        'http://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_2350.jpg',
    )
    setOriginalImage(
      'http://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_2441.jpg',
    )
  }, [setOriginalImage, setFilteredImage, capturedImage])

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 text-black">
      <div className="relative rounded-2xl bg-white shadow-lg"></div>
      <div className="flex h-screen w-screen flex-col items-center bg-white">
        <h1 className="my-5 text-2xl font-semibold text-gray-900">
          AIシミュレーター
        </h1>
        {isStreaming && (
          <video
            ref={videoRef}
            autoPlay
            width={960}
            height={720}
            className="w-1/2 rounded-lg shadow"
          />
        )}
        {!isStreaming && (
          <div className="h-full w-1/2 overflow-hidden">
            <SimulationImage
              originalImage={originalImage}
              filteredImage={filteredImage || originalImage}
            />
            {/* <img
              src={
                capturedImage ||
                'http://empowerme-cloud.com/wp-content/uploads/2023/10/IMG_2389-scaled.jpg'
              }
              alt="Captured"
              width={960}
              height={720}
              className="w-full h-full object-cover rounded-lg shadow"
            /> */}
          </div>
        )}

        <div className="flex items-center">
          {!isStreaming && (
            <button
              onClick={startVideoStream}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              カメラ開始して撮影
            </button>
          )}

          {isStreaming && (
            <button
              onClick={takePicture}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              撮影
            </button>
          )}
          <p className="mx-2">または</p>
          <input type="file" />
          <button
            className="m-2 rounded-xl border bg-main-50 p-2"
            onClick={handleEyeSimulation}
          >
            目シミュレーション
          </button>
          <button
            className="m-2 rounded-xl border bg-main-50 p-2"
            onClick={handleNoseSimulation}
          >
            鼻シミュレーション
          </button>
          <button
            className="m-2 rounded-xl border bg-main-50 p-2"
            onClick={handleToothSimulation}
          >
            歯シミュレーション
          </button>
          <button
            className="m-2 rounded-xl border bg-main-50 p-2"
            onClick={handleMakeUpSimulation}
          >
            アートメイクシミュレーション
          </button>
          <button
            onClick={cancelCamera}
            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            キャンセル
          </button>
        </div>

        {/* Hidden canvas element for capturing image */}
        <canvas ref={canvasRef} width={960} height={720} className="hidden" />
      </div>
    </div>
  )
}

export default CameraComponent
