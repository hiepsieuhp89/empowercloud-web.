'use client'

import { useDebounce } from '@/components/AddLabelPopup'
import Pagination from '@/components/Pagination'
import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import type { Room } from '@/gen/proto/v1/room_pb'
import type { RoomType } from '@/gen/proto/v1/room_type_pb'
import { createRoom, deleteRoom, roomList, updateRoom } from '@/server/room'
import { roomTypeList } from '@/server/room_type'
import { useEffect, useMemo, useState } from 'react'
import { DeleteRoomModal } from './DeleteRoomModal'
import { EditRoomModal } from './EditRoomModal'

export function RoomList() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectedType, setSelectedType] = useState<number>(0)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false)
  const [selectedRoomId, setSelectedRoomId] = useState<number>(0)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const pageSize = 20
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await roomTypeList()
        setRoomTypes(response)
      } catch (error) {
        console.error(error)
      }
    }
    fetchRoomTypes()
  }, [])

  const debouncedKeyword = useDebounce(keyword, 300)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomList(
          debouncedKeyword,
          selectedType,
          currentPage,
          pageSize,
        )
        setRooms(response.rooms)
        setTotal(Math.ceil(response.total / pageSize))
      } catch (error) {
        console.error(error)
      }
    }
    fetchRooms()
  }, [currentPage, selectedType, debouncedKeyword])

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(selectedRoomId)
      setRooms(rooms.filter((room) => room.id !== selectedRoomId))
    } catch (error) {
      console.error(error)
    } finally {
      setIsOpenDeleteModal(false)
      setSelectedRoomId(0)
    }
  }

  const updateRoomOrder = useMemo(
    () => async (index: number, id: number) => {
      console.log('id is ', id)
      const roomData = rooms.findLast((i) => Number(i.id) == index)

      await updateRoom(
        index,
        roomData?.roomName || '',
        roomData?.roomInfo || '',
        roomData?.typeId || 0,
        id + 1,
      )
    },
    [rooms],
  )

  const handleUpdateRoom = async (
    roomName: string,
    roomInfo: string,
    typeId: number,
  ) => {
    try {
      await updateRoom(selectedRoomId, roomName, roomInfo, typeId)
      const typeName = roomTypes.find((item) => item.id === typeId)?.type
      const newRooms = rooms.map((room) => {
        if (room.id === selectedRoomId) {
          return {
            ...room,
            roomName,
            roomInfo,
            typeId,
            typeName,
          }
        }
        return room
      }) as Room[]
      setRooms(newRooms)
    } catch (error) {
      console.error(error)
    } finally {
      setIsOpenEditModal(false)
      setSelectedRoomId(0)
    }
  }

  const handleCreateRoom = async (
    roomName: string,
    roomInfo: string,
    typeId: number,
  ) => {
    try {
      const response = await createRoom(roomName, roomInfo, typeId)
      if (response) {
        const typeName = roomTypes.find((item) => item.id === typeId)?.type
        const newRoom = {
          id: response.id,
          roomName,
          roomInfo,
          typeId,
          typeName,
        } as Room
        setRooms((prev) => [...prev, newRoom])
      }
    } catch (error) {
      console.log('create room error:: ', error)
    } finally {
      setIsOpenEditModal(false)
    }
  }

  const column = useMemo(() => {
    return [
      // {
      //   title: 'ID',
      //   index: 'id',
      //   render: (value: number) => {
      //     return (
      //       <div className="mx-4 flex w-full py-2">
      //         <p className="mx-4">{value}</p>
      //       </div>
      //     )
      //   },
      //   className:
      //     'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b py-2',
      // },
      {
        title: '部屋名',
        index: 'roomName',
        render: (value: string) => {
          return (
            <div className="mx-4 flex w-full py-2">
              <p className="mx-4">{value}</p>
            </div>
          )
        },
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b py-2',
      },
      {
        title: '部屋情報',
        index: 'roomInfo',
        render: (value: string) => {
          return (
            <div className="mx-4 flex w-full py-2">
              <p className="mx-4">{value}</p>
            </div>
          )
        },
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b py-2',
      },
      {
        title: '部屋種類',
        index: 'typeName',
        render: (value: string) => {
          return (
            <div className="mx-4 flex w-full py-2">
              <p className="mx-4">{value}</p>
            </div>
          )
        },
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b py-2',
      },
      {
        title: '_',
        index: 'edit',
        render: (_: string, item: DataItem) => {
          return (
            <div className="mx-4 flex w-full justify-center gap-2 py-2">
              <button
                className="flex items-center justify-center rounded-xl border px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedRoomId(item.id)
                  const selectedRoom = rooms.find((room) => room.id === item.id)
                  setSelectedRoom(selectedRoom as Room)
                  setIsOpenEditModal(true)
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                編集
              </button>
              <button
                className="flex items-center justify-center rounded-xl border px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedRoomId(item.id)
                  setIsOpenDeleteModal(true)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#f44336"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                削除
              </button>
            </div>
          )
        },
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b py-2',
      },
    ]
  }, [rooms])
  return (
    <div className="w-full">
      <div className="my-4 block w-full text-gray-500">
        <div className="flex w-full bg-main-50 p-4 font-bold">
          <h1>部屋設定</h1>
        </div>
        <div className="w-full justify-center px-4">
          <div className="flex justify-between py-2">
            <div className="flex h-10 items-center gap-4">
              <label htmlFor="search" className="font-bold text-black">
                キーワード
              </label>
              <input
                type="text"
                name="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-10 w-[400px] rounded-md border text-[14px] text-black"
              />
              <select
                name="typeId"
                className="h-10 rounded-md px-2 text-black"
                defaultValue={selectedType}
                onChange={(e) => setSelectedType(Number(e.target.value))}
              >
                <option value={0}>-------</option>
                {roomTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.type}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="w-[240px] rounded-md border bg-primary-admin px-4 text-gray-800"
              onClick={(e) => {
                e.preventDefault()
                setIsOpenEditModal(true)
              }}
            >
              + 新規
            </button>
          </div>
          <div>
            <Table
              columns={column}
              data={rooms}
              onRowClick={() => {}}
              draggable={true}
              onRowMoved={updateRoomOrder}
            />
          </div>
          <div className="mt-4 flex w-full justify-center">
            {total > 0 && (
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={total}
              />
            )}
          </div>
          <DeleteRoomModal
            isOpen={isOpenDeleteModal}
            onClose={() => setIsOpenDeleteModal(false)}
            handleDelete={handleDeleteRoom}
          />
          <EditRoomModal
            isOpen={isOpenEditModal}
            onClose={() => setIsOpenEditModal(false)}
            handleUpdateRoom={handleUpdateRoom}
            handleCreateRoom={handleCreateRoom}
            selectedRoom={selectedRoom}
            roomTypes={roomTypes}
          />
        </div>
      </div>
    </div>
  )
}
