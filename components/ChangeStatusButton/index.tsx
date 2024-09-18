import React from 'react'

const statuses = [
  '受付待ち',
  '診察待ち',
  '診察中',
  '会計待ち',
  '会計完了',
  '-',
  '-',
  '-',
  '-',
  'キャンセル',
]

type StatusButtonProps = {
  initialStatus: number
  handleUpdateStatus: (id: bigint, status: number) => void
  convertStatusToClassName: (status: number) => string
  receptionId: bigint
}

const StatusButton: React.FC<StatusButtonProps> = ({
  initialStatus,
  handleUpdateStatus,
  convertStatusToClassName,
  receptionId,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    const nextIndex = initialStatus + 1
    if (initialStatus === 5) return
    handleUpdateStatus(receptionId, nextIndex)
  }
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={initialStatus === 5}
        className={`rounded-md ${convertStatusToClassName(initialStatus)} cursor-pointer px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {statuses[initialStatus - 1]}
      </button>
    </div>
  )
}

export default StatusButton
