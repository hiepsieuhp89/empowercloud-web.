import CommonModal from '@/components/CommonModal'
import type { Room } from '@/gen/proto/v1/room_pb'
import type { RoomType } from '@/gen/proto/v1/room_type_pb'
import { useCallback } from 'react'
type Props = {
  isOpen: boolean
  onClose: () => void
  handleUpdateRoom: (name: string, info: string, typeId: number) => void
  handleCreateRoom: (name: string, info: string, typeId: number) => void
  selectedRoom?: Room | null
  roomTypes: RoomType[]
}
export function EditRoomModal({
  isOpen,
  onClose,
  handleUpdateRoom,
  handleCreateRoom,
  selectedRoom,
  roomTypes,
}: Props) {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      const data = new FormData(e.currentTarget)
      const dataObj = Object.fromEntries(data.entries())
      try {
        const name = String(dataObj.name)
        const info = String(dataObj.info)
        const typeId = Number(dataObj.type)
        if (selectedRoom) {
          handleUpdateRoom(name, info, typeId)
        } else {
          handleCreateRoom(name, info, typeId)
        }
      } catch (error) {
        console.log('Error::: ', error)
      } finally {
        form.reset()
      }
    },
    [handleUpdateRoom, selectedRoom, handleCreateRoom],
  )
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} className="p-2">
      <div className="w-full">
        <div>
          <h1 className="text-left">部屋編集</h1>
          <form className="p-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 ">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-left text-[14px]">
                  部屋名
                </label>
                <input
                  type="text"
                  name="name"
                  className="rounded border border-gray-300 px-2 py-1"
                  defaultValue={selectedRoom?.roomName}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="info" className="text-left text-[14px]">
                  部屋情報
                </label>
                <input
                  type="text"
                  name="info"
                  className="rounded border border-gray-300 px-2 py-1"
                  defaultValue={selectedRoom?.roomInfo}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="type" className="text-left text-[14px]">
                  種類
                </label>
                <select
                  name="type"
                  className="h-[40px]"
                  defaultValue={selectedRoom?.typeId}
                >
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-8 flex w-full justify-center gap-20">
              <button
                className="w-[100px] rounded bg-gray-500 p-2 text-white"
                onClick={onClose}
              >
                戻る
              </button>
              <button
                className="w-[100px] rounded bg-blue-500 p-2 text-white"
                type="submit"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </CommonModal>
  )
}
