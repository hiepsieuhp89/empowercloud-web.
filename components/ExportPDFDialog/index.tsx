import React from 'react'
import Modal from 'react-modal'

interface ExportPDFDialogParams {
  printOption: string
  setShowPrintOption: React.Dispatch<React.SetStateAction<boolean>>
  showPrintOption: boolean
  handlePrintOptionChange: (event: {
    target: {
      value: React.SetStateAction<string>
    }
  }) => void
  handleDownload: () => Promise<void>
  title: string
  buttonText: string
}
const ExportPDFDialog: React.FC<ExportPDFDialogParams> = ({
  printOption,
  setShowPrintOption,
  showPrintOption,
  handlePrintOptionChange,
  handleDownload,
  title,
  buttonText,
}) => {
  return (
    <Modal
      isOpen={showPrintOption}
      onRequestClose={() => setShowPrintOption(false)}
      contentLabel="Example Modal"
      overlayClassName="fixed inset-0 z-30 flex items-center justify-center bg-black/50 text-black"
      className="elative rounded-2xl bg-white shadow-lg"
    >
      <div className="absolute right-0 top-0 mr-[-4px] mt-[-4px] size-4 rounded-2xl bg-gray-700 text-center text-xs font-bold text-white">
        <button onClick={() => setShowPrintOption(false)}>X</button>
      </div>
      <div className="w-full min-w-[500px] rounded-t-2xl bg-primary p-8 text-center text-xl font-bold">
        {title}
      </div>
      <div className="block w-full p-16">
        <label className="block w-full">
          <input
            type="radio"
            value="printer"
            checked={printOption === 'printer'}
            onChange={handlePrintOptionChange}
          />
          プリンターで印刷
        </label>
        <label className="block w-full">
          <input
            type="radio"
            value="pdf"
            checked={printOption === 'pdf'}
            onChange={handlePrintOptionChange}
          />
          PDFで保存
        </label>
        {/* <label className="block w-full">
          <input
            type="radio"
            value="email"
            checked={printOption === 'email'}
            onChange={handlePrintOptionChange}
          />
          メールで送信
        </label> */}
        {printOption === 'email' && (
          <input
            type="email"
            placeholder="受信メール"
            className="border-gray-500"
          ></input>
        )}
      </div>
      <div className="flex">
        <div className="mx-auto"></div>
        <button
          className="mx-auto my-2 block rounded-2xl bg-white px-4 py-2"
          onClick={() => setShowPrintOption(false)}
        >
          キャンセル
        </button>
        <button
          className="mx-auto my-2 block rounded-2xl bg-primary px-4 py-2"
          onClick={handleDownload}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  )
}

export default ExportPDFDialog
