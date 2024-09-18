'use client'
import CommonModal from '@/components/CommonModal'
import EditableExpiredAfter from '@/components/EditableExpiredAfter'
import EditableInput from '@/components/EditableInput'
import MultiDoctorSelection from '@/components/MultiDoctorSelection'
import { MenuItem } from '@/gen/proto/v1/menu_pb'
import type { Doctor } from '@/gen/proto/v1/reception_pb'
import type { Room } from '@/gen/proto/v1/room_pb'
import { getDoctorList } from '@/server/doctor'
import {
  createExaminationRoom,
  deleteExaminationRoom,
} from '@/server/examination_room'
import { listMenu, updateMenus } from '@/server/menu'
import { roomList } from '@/server/room'
import type { SessionProps, SessionUser } from '@/utils/type'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AttachRoomModal } from './AttachRoomModal'

const MenuList: React.FC<SessionProps> = ({ session }) => {
  const user = useMemo(() => {
    return session?.user as SessionUser
  }, [session])

  const [menuData, setMenuData] = useState<MenuItem[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [targetMenuId, setTargetMenuId] = useState<number>(0)
  const [showDoctorPopup, setShowDoctorPopup] = useState<boolean>(false)
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<number[]>([])
  const [isOpenAttachRoomModal, setIsOpenAttachRoomModal] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null)

  const handleSelectDoctors = () => {
    menuData[targetMenuId].doctorIds = selectedDoctorIds
    menuData[targetMenuId].updateType = 'UPDATE'
    const tmpData = menuData.slice()
    setMenuData(tmpData)
    setShowDoctorPopup(false)
  }

  const closeModal = useCallback(() => {
    setModalIsOpen(false)
    setErrorMessage('')
  }, [setModalIsOpen, setErrorMessage])

  const sortData = useCallback((dataTmp: MenuItem[]) => {
    const sortedData = [...dataTmp].sort((a, b) => {
      if (a.examinationCategory !== b.examinationCategory) {
        return b.examinationCategory.localeCompare(a.examinationCategory)
      }
      if (a.majorCategory !== b.majorCategory) {
        // If ages are equal, sort by name
        return a.majorCategory.localeCompare(b.majorCategory)
      }

      if (a.minorCategory !== b.minorCategory) {
        // If ages are equal, sort by name
        return a.minorCategory.localeCompare(b.minorCategory)
      }

      return a.bodyPartCategory.localeCompare(b.bodyPartCategory)
    })
    setMenuData(sortedData)
  }, [])

  const getRowSpans = useCallback(
    (itemId: number, columId: number) => {
      const menuItem = menuData[itemId]
      let rowSpan = 0
      let firstIndex = -1
      switch (columId) {
        case 1:
          firstIndex = menuData.findIndex(
            (item) => item.examinationCategory === menuItem.examinationCategory,
          )
          rowSpan = menuData.filter(
            (item) => item.examinationCategory === menuItem.examinationCategory,
          ).length
          break
        case 2:
          firstIndex = menuData.findIndex(
            (item) =>
              item.examinationCategory === menuItem.examinationCategory &&
              item.majorCategory === menuItem.majorCategory,
          )
          rowSpan = menuData.filter(
            (item) =>
              item.examinationCategory === menuItem.examinationCategory &&
              item.majorCategory === menuItem.majorCategory,
          ).length
          break
        case 3:
          firstIndex = menuData.findIndex(
            (item) =>
              item.examinationCategory === menuItem.examinationCategory &&
              item.majorCategory === menuItem.majorCategory &&
              item.minorCategory === menuItem.minorCategory,
          )
          rowSpan = menuData.filter(
            (item) =>
              item.examinationCategory === menuItem.examinationCategory &&
              item.majorCategory === menuItem.majorCategory &&
              item.minorCategory === menuItem.minorCategory,
          ).length
          break
        default:
          return 1
      }

      if (firstIndex < itemId) {
        rowSpan = 0
      }
      return rowSpan
    },
    [menuData],
  )

  const fetchMenuList = useCallback(async () => {
    const dummyData = await listMenu(user.clinic_id) //generateMenuDummyData()
    sortData(dummyData.items)
  }, [sortData, user.clinic_id])

  useEffect(() => {
    fetchMenuList()
  }, [fetchMenuList])

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await getDoctorList({
        keyword: '',
        page: 1,
        size: 100,
        clinnicId: user.clinic_id,
      })
      const newDoctors = response.doctors
      setDoctors((prevDoctors) => {
        const updatedDoctors = Array.from(
          new Set([...prevDoctors, ...newDoctors].map((d) => d.id)),
        ).map((id) => [...prevDoctors, ...newDoctors].find((d) => d.id === id)!)
        return updatedDoctors
      })
    } catch (error) {
      setErrorMessage('エラーが発生しました。医師一覧を取得できません。')
      setModalIsOpen(true)
    }
  }, [setDoctors, setErrorMessage, setModalIsOpen, user])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  const fetchRoomsData = async () => {
    try {
      const response = await roomList('', 0, 1, 100)
      setRooms(response.rooms)
    } catch (error) {
      setErrorMessage('エラーが発生しました。部屋一覧を取得できません。')
    }
  }

  useEffect(() => {
    fetchRoomsData()
  }, [])

  const showEditDoctor = useCallback(
    (value: number, item: MenuItem) => {
      setTargetMenuId(value)
      setSelectedDoctorIds(item.doctorIds)
      setShowDoctorPopup(true)
    },
    [setTargetMenuId, setSelectedDoctorIds, setShowDoctorPopup],
  )

  const removeItem = useCallback(
    (itemId: number) => {
      if (menuData[itemId].id > 0) {
        menuData[itemId].updateType =
          menuData[itemId].updateType == 'DELETE' ? 'UPDATE' : 'DELETE'
        const tmpData = menuData.slice()
        setMenuData(tmpData)
      } else {
        const tmpData = menuData.slice()
        tmpData.splice(itemId, 1)
        sortData(tmpData)
      }
    },
    [menuData, sortData, setMenuData],
  )
  const addItem = useCallback(() => {
    const tmpData = menuData.slice()
    tmpData.push(
      MenuItem.fromJson({
        examination_category: '',
        major_category: '',
        minor_category: '',
        body_part_category: '',
        price: 1,
        updateType: 'NEW',
        clinic_id: user.clinic_id,
        quantity: 1,
        expired_after: 12,
      }),
    )
    setMenuData(tmpData)
  }, [menuData, setMenuData, user])

  const handleChange = useCallback(
    (val: string | number, itemId: number, columId: number) => {
      const tmpData = menuData.slice()
      const targetRow = getRowSpans(itemId, columId)
      for (let i = itemId; i < itemId + targetRow; i++) {
        switch (columId) {
          case 1:
            tmpData[i].examinationCategory = String(val)
            break
          case 2:
            tmpData[i].majorCategory = String(val)
            break
          case 3:
            tmpData[i].minorCategory = String(val)
            break
          case 4:
            tmpData[i].bodyPartCategory = String(val)
            break
          case 5:
            tmpData[i].price = Number(val)
            break
          case 6:
            tmpData[i].quantity = Number(val)
            break
          case 7:
            tmpData[i].expiredAfter = Number(val)
            break
        }
        if (tmpData[i].updateType == '') {
          tmpData[i].updateType = 'UPDATE'
        }
      }

      sortData(tmpData)
    },
    [menuData, getRowSpans, sortData],
  )

  const updateMenuData = useCallback(async () => {
    await updateMenus(menuData.filter((i) => i.updateType != ''))
    setErrorMessage('診察メニューを更新しました')
    setModalIsOpen(true)
    await fetchMenuList()
  }, [menuData, setErrorMessage, setModalIsOpen, fetchMenuList])

  const getRowClass = useCallback((item: MenuItem) => {
    switch (item.updateType) {
      case 'DELETE':
        return 'bg-gray-300 text-white'
      case 'NEW':
        return 'bg-green-300 text-black'
      default:
        return ''
    }
  }, [])

  const handleOpenAttachRoomModal = () => {
    setIsOpenAttachRoomModal(true)
  }

  const handleCloseAttachRoomModal = () => {
    setSelectedMenu(null)
    setIsOpenAttachRoomModal(false)
  }

  const handleAttachRoom = async (menuId: number, roomId: number) => {
    try {
      const response = await createExaminationRoom(roomId, menuId)
      if (response) {
        setMenuData((prev) => {
          return prev.map((item) => {
            if (item.id === menuId) {
              item.roomIds.push(roomId)
            }
            return item
          })
        })
      }
    } catch (error) {
      setErrorMessage('エラーが発生しました。部屋のリンクを更新できません。')
      setModalIsOpen(true)
    }
  }

  const handleDeleteRoom = async (roomId: number, menuId: number) => {
    try {
      const response = await deleteExaminationRoom(roomId, menuId)
      if (response) {
        setMenuData((prev) => {
          return prev.map((item) => {
            item.roomIds = item.roomIds.filter((id) => id !== roomId)
            return item
          })
        })
      }
    } catch (error) {
      console.log('delete room error: ', error)
    }
  }

  return (
    <div className="w-full">
      <div className="my-4 flex h-70v w-full overflow-scroll text-gray-500">
        <table className="w-full border text-center">
          <thead className="z-1 sticky top-0 bg-main-50">
            <tr>
              <th className="min-w-[150px] border">診察カテゴリー</th>
              <th className="min-w-[200px] border">大カテゴリー</th>
              <th className="min-w-[200px] border">小カテゴリー</th>
              <th className="min-w-[200px] border">部位カテゴリー</th>
              <th className="min-w-[100px] border">価額</th>
              <th className="min-w-[200px] border">担当者</th>
              <th className="min-w-[200px] border">部屋</th>
              <th className="min-w-[50px] border">数量</th>
              <th className="min-w-[100px] border">有効期限</th>
              <th className="min-w-[20px] border"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {menuData.map((item, _i) => (
              <tr
                key={`menu_item_${_i}_${item.id}`}
                className={`${getRowClass(item)}`}
              >
                {getRowSpans(_i, 1) > 0 && (
                  <td className="border" rowSpan={getRowSpans(_i, 1)}>
                    <EditableInput
                      value={item.examinationCategory}
                      setValue={(e) => handleChange(e, _i, 1)}
                    />
                  </td>
                )}

                {getRowSpans(_i, 2) > 0 && (
                  <td className="border" rowSpan={getRowSpans(_i, 2)}>
                    <EditableInput
                      value={item.majorCategory}
                      setValue={(e) => handleChange(e, _i, 2)}
                    />
                  </td>
                )}

                {getRowSpans(_i, 3) > 0 && (
                  <td className="border" rowSpan={getRowSpans(_i, 3)}>
                    <EditableInput
                      value={item.minorCategory}
                      setValue={(e) => handleChange(e, _i, 3)}
                    />
                  </td>
                )}

                <td className="border">
                  <EditableInput
                    value={item.bodyPartCategory}
                    setValue={(e) => handleChange(e, _i, 4)}
                  />
                </td>

                <td className="border">
                  <EditableInput
                    value={item.price}
                    setValue={(e) => handleChange(e, _i, 5)}
                  />
                </td>

                <td className="border">
                  <div className="flex">
                    <p className="mx-auto">
                      {doctors
                        .filter((i) => item.doctorIds.includes(i.id))
                        .map((i) => i.name)
                        .join(',')}
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 cursor-pointer"
                      onClick={() => showEditDoctor(_i, item)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </div>
                </td>

                <td className="border">
                  <div className="flex justify-between">
                    <p className="mx-auto break-words">
                      {rooms
                        .filter((i) => item.roomIds.includes(i.id))
                        .map((i) => i.roomName)
                        .join(',')}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedMenu(item)
                        handleOpenAttachRoomModal()
                      }}
                      className="px-2 text-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="border">
                  <EditableInput
                    value={item.quantity}
                    setValue={(e) => handleChange(e, _i, 6)}
                  />
                </td>
                <td className="border">
                  <EditableExpiredAfter
                    value={item.expiredAfter}
                    setValue={(e) => handleChange(e, _i, 7)}
                  />
                </td>
                <td className="border">
                  <button onClick={() => removeItem(_i)}>
                    {item.updateType != 'DELETE' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="red"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}

                    {item.updateType == 'DELETE' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="blue"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15 3.75A5.25 5.25 0 0 0 9.75 9v10.19l4.72-4.72a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 1 1 1.06-1.06l4.72 4.72V9a6.75 6.75 0 0 1 13.5 0v3a.75.75 0 0 1-1.5 0V9c0-2.9-2.35-5.25-5.25-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-4 flex w-full">
        <button
          className="mx-4 rounded bg-main-200 p-2"
          onClick={() => addItem()}
        >
          追加
        </button>
        <button className="rounded bg-main-200 p-2" onClick={updateMenuData}>
          保存
        </button>
      </div>
      <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
        <div className="text-blue-500">{errorMessage}</div>
      </CommonModal>
      <AttachRoomModal
        isOpen={isOpenAttachRoomModal}
        onClose={handleCloseAttachRoomModal}
        selectedMenu={selectedMenu}
        handleAttachRoom={handleAttachRoom}
        rooms={rooms}
        handleDeleteRoom={handleDeleteRoom}
      />
      <MultiDoctorSelection
        onSelect={handleSelectDoctors}
        setSelectedDoctorIds={setSelectedDoctorIds}
        selectedDoctorIds={selectedDoctorIds || []}
        doctors={doctors}
        styleSelect=""
        isOpen={showDoctorPopup}
        onClose={() => setShowDoctorPopup(false)}
      />
    </div>
  )
}

export default MenuList
