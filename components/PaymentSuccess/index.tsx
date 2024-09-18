import ExportPDFDialog from '@/components/ExportPDFDialog'
import React, { useCallback, useState } from 'react'

interface PaymentSuccessParams {
  isDisplay: boolean
  setIsDisplay: React.Dispatch<React.SetStateAction<boolean>>
  contentId?: string
  title: string
}
const PaymentSuccess: React.FC<PaymentSuccessParams> = ({
  isDisplay,
  setIsDisplay,
  title,
  contentId,
}) => {
  const [printOption, setPrintOption] = useState('pdf')
  const [documentType, setDocumentType] = useState('')
  const [showPrintOption, setShowPrintOption] = useState(false)

  const handleDownload = useCallback(async () => {
    if (printOption == 'printer') {
      if (typeof window !== 'undefined') {
        // Use window.open to open the URL in a new tab
        window.open(
          `/api/export/${documentType}?orderId=${contentId}`,
          '_blank',
        )
      }
      return
    }
    try {
      // Send a POST request to the API route
      const response = await fetch(`/api/export/${documentType}`, {
        method: 'POST',
        body: JSON.stringify({
          orderId: contentId,
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
        link.download = documentType == 'receipt' ? '領収書.pdf' : '処方箋.pdf'

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
  }, [printOption, documentType, contentId])

  const handlePrintOptionChange = useCallback(
    (event: { target: { value: React.SetStateAction<string> } }) => {
      setPrintOption(event.target.value)
    },
    [setPrintOption],
  )

  const handleExportReceipt = useCallback(() => {
    setShowPrintOption(true)
    setDocumentType('receipt')
  }, [setShowPrintOption, setDocumentType])

  const _handleExportOther = useCallback(() => {
    setShowPrintOption(true)
    setDocumentType('other')
  }, [setShowPrintOption, setDocumentType])

  return (
    <>
      {isDisplay && !showPrintOption && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 text-black">
          <div className="relative rounded bg-white shadow-lg">
            <div className="absolute right-0 top-0 mr-[-4px] mt-[-4px] size-4 rounded-2xl bg-gray-700 text-center text-xs font-bold text-white">
              <button onClick={() => setIsDisplay(false)}>X</button>
            </div>
            <div className="block p-16">
              <p className="mx-auto my-2 block px-4 py-2 pb-8 text-center text-2xl font-bold">
                {title}
              </p>
              {/* <button
                className="mx-auto my-2 block rounded-2xl bg-main-200 px-4 py-2"
                onClick={handleExportOther}
              >
                処方箋をエクスポートする
              </button> */}
              <button
                className="mx-auto my-2 block rounded-2xl bg-blue-300 px-4 py-2"
                onClick={handleExportReceipt}
              >
                領収書をエクスポートする
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrintOption && documentType == 'receipt' && (
        <ExportPDFDialog
          printOption={printOption}
          title="領収書をエクスポートする"
          buttonText="領収書をエクスポートする"
          setShowPrintOption={setShowPrintOption}
          handlePrintOptionChange={handlePrintOptionChange}
          handleDownload={handleDownload}
          showPrintOption={showPrintOption}
        />
      )}

      {showPrintOption && documentType == 'other' && (
        <ExportPDFDialog
          printOption={printOption}
          title="処方箋をエクスポートする"
          buttonText="処方箋をエクスポートする"
          setShowPrintOption={setShowPrintOption}
          handlePrintOptionChange={handlePrintOptionChange}
          handleDownload={handleDownload}
          showPrintOption={showPrintOption}
        />
      )}
    </>
  )
}

export default PaymentSuccess
