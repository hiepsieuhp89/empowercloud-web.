// components/Modal.tsx
import type { ReactNode } from 'react'
import React from 'react'
import Modal from 'react-modal'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

const CommonModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Example Modal"
      overlayClassName="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
      className={`relative max-h-full overflow-auto rounded-lg bg-white text-black ${className}`}
      ariaHideApp={false}
    >
      <button
        onClick={onClose}
        className="absolute right-0 top-0 flex size-6 items-center text-4xl text-red-500"
      >
        &times;
      </button>
      <div className="size-full p-8">{children}</div>
    </Modal>
  )
}

export default CommonModal
