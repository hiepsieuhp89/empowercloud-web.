'use client'

import CommonModal from '@/components/CommonModal'
import type { MenuItem } from '@/gen/proto/v1/menu_pb'
import type { Room } from '@/gen/proto/v1/room_pb'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  selectedMenu: MenuItem | null
  handleAttachRoom: (menuId: number, roomId: number) => Promise<void>
  rooms: Room[]
  handleDeleteRoom: (roomId: number, menuId: number) => Promise<void>
}
export function AttachRoomModal({
  isOpen,
  onClose,
  selectedMenu,
  handleAttachRoom,
  rooms,
  handleDeleteRoom,
}: Props) {
  const menuId = selectedMenu?.id || 0
  const [selectedRoomId, setSelectedRoomId] = useState<number>(0)

  const [selectedRooms, setSelectedRooms] = useState<
    { roomId: number; name: string }[]
  >([])
  useEffect(() => {
    const existsRooms = rooms
      .filter((room) => selectedMenu?.roomIds?.includes(room.id))
      .map((room) => ({
        roomId: room.id,
        name: room.roomName,
      }))
    setSelectedRooms(existsRooms)
  }, [selectedMenu, rooms])

  const handleSave = useCallback(() => {
    handleAttachRoom(menuId, selectedRoomId)
    setSelectedRoomId(0)
    onClose()
  }, [menuId, selectedRoomId, handleAttachRoom, onClose])

  const handleDelete = useCallback(
    async (roomId: number) => {
      await handleDeleteRoom(roomId, menuId)
      setSelectedRooms((prev) => prev.filter((room) => room.roomId !== roomId))
    },
    [menuId, handleDeleteRoom],
  )

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} className="w-[400px] p-2">
      <div className="flex flex-col gap-3">
        <h1 className="text-center font-bold">メニューと部屋連携</h1>
        <div>
          {/* <h2 className="my-1 text-left font-light">部屋専用</h2> */}
          <ul className="list-disc pl-5">
            {selectedRooms.map((room) => (
              <li key={room.roomId} className="flex justify-between">
                <span>{room.name}</span>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(room.roomId)}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-10">
          <label>専用部屋</label>
          <select
            defaultValue={selectedMenu?.roomIds?.[0]}
            onChange={(e) => setSelectedRoomId(Number(e.target.value))}
            className="h-10 w-full rounded-md border border-gray-400 px-2 py-1"
          >
            <option value="">---</option>
            {rooms.map((room) => (
              <option
                key={room.id}
                value={room.id}
                disabled={Boolean(
                  selectedRooms.find((i) => i.roomId === room.id),
                )}
              >
                {room.roomName}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-8 flex w-full justify-center gap-10">
          <button
            className="w-[100px] rounded-md bg-gray-400 p-2"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="w-[100px] rounded-md bg-blue-400 p-2"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </CommonModal>
  )
}
