import CommonModal from '@/components/CommonModal'
type Props = {
  isOpen: boolean
  onClose: () => void
  handleDelete: () => void
}
export function DeleteRoomModal({ isOpen, onClose, handleDelete }: Props) {
  //   const handleDelete = async () => {
  //     try {
  //       await deleteRoom(roomId)
  //     } catch (error) {
  //       console.error(error)
  //     } finally {
  //       onClose()
  //     }
  //   }
  return (
    <CommonModal isOpen={isOpen} onClose={onClose}>
      <div className="w-96">
        <h1 className="text-center text-2xl font-bold">部屋を削除</h1>
        <p className="mt-4 text-center">この部屋を削除しますか？</p>
        <div className="mt-8 flex justify-center">
          <button
            className="rounded bg-red-500 px-4 py-2 text-white"
            onClick={handleDelete}
          >
            削除
          </button>
          <button
            className="ml-4 rounded bg-gray-300 px-4 py-2 text-gray-500"
            onClick={onClose}
          >
            キャンセル
          </button>
        </div>
      </div>
    </CommonModal>
  )
}
