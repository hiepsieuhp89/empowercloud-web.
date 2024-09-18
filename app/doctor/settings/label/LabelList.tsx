'use client'

import CommonModal from '@/components/CommonModal'
import LabelIcon from '@/components/Icons/LabelIcon'
import Pagination from '@/components/Pagination'
import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import type { Label } from '@/gen/proto/v1/reception_pb'
import type { CreateLabelRequest, UpdateLabelRequest } from '@/server/label'
import {
  createLabel,
  deleteLabel,
  labelList,
  updateLabel,
} from '@/server/label'
import React, { useEffect, useMemo, useState } from 'react'
import CreateLabelModal from './CreateLabelModal'

const LabelList: React.FC = () => {
  // モーダルの表示制御用のステート
  const [showModal, setShowModal] = useState(false)
  const [labels, setLabels] = useState<Label[]>([])
  const [selectedLabel, setSelectedLabel] = useState<Label>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [removeModal, setRemoveModal] = useState(false)
  const pageSize = 10

  const showRemoveConfirmDialog = (label: DataItem) => {
    setSelectedLabel(label as Label)
    setRemoveModal(true)
  }

  const closeRemoveModal = () => {
    setRemoveModal(false)
  }
  // モーダルを開く関数
  const openModal = () => {
    setShowModal(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await labelList({
          keyword: '',
          page: currentPage,
          size: pageSize,
        })
        const labels = response.labels.sort(
          (a, b) => Number(b.sort) - Number(a.sort),
        )
        setLabels(labels)
        setTotal(Math.ceil(response.total / pageSize))
      } catch (e) {
        console.log('error is', e)
      }
    }
    fetchData()
  }, [currentPage])

  const handleCreateLabel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(e.currentTarget)
    const dataObj = Object.fromEntries(data.entries())
    try {
      const label: CreateLabelRequest = {
        name: String(dataObj.name),
        color: String(dataObj.color),
        description: String(dataObj.description),
      }

      const response = await createLabel(label)
      if (response) {
        setLabels((prev) =>
          [...prev, response].sort((a, b) => Number(b.id) - Number(a.id)),
        )
      }
    } catch (e) {
      console.log('Error::: ', e)
    } finally {
      form.reset()
      setShowModal(false)
    }
  }

  const handleUpdateLabel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(e.currentTarget)
    const dataObj = Object.fromEntries(data.entries())
    const name = String(dataObj.name)
    const color = String(dataObj.color)
    const description = String(dataObj.description)
    try {
      const label: UpdateLabelRequest = {
        id: selectedLabel?.id as bigint,
        name,
        color,
        description,
      }

      await updateLabel(label)
      const updatedLabels = labels.map((item) => {
        if (item.id === selectedLabel?.id) {
          const label = {
            id: selectedLabel?.id as bigint,
            name,
            color,
            description,
          } as Label
          return label
        }
        return item
      })
      setLabels(updatedLabels)
    } catch (error) {
      console.log('Error::: ', error)
    } finally {
      form.reset()
      setShowModal(false)
    }
  }

  const updateLabelOrder = useMemo(
    () => async (index: number, id: number) => {
      const labelData = labels.findLast((i) => Number(i.id) === index)
      const label: UpdateLabelRequest = {
        id: labelData?.id as bigint,
        name: labelData?.name || '',
        color: labelData?.color || '',
        description: labelData?.description || '',
        sort: id + 1,
      }

      await updateLabel(label)
    },
    [labels],
  )

  const handleOpenUpdateModal = useMemo(
    () => (id: number) => {
      setSelectedLabel(labels.find((label) => Number(label.id) == id))
      setShowModal(true)
    },
    [labels],
  )

  const handleDeleteLabel = async () => {
    if (!selectedLabel) {
      return
    }
    const id = Number(selectedLabel.id)
    try {
      const response = await deleteLabel(id)
      if (response) {
        setLabels((prev) => prev.filter((label) => Number(label.id) != id))
      }
      closeRemoveModal()
    } catch (e) {
      window.alert('削除できません。')
      console.log('Error::: ', e)
    }
  }

  const columns = useMemo(
    () => [
      {
        title: 'ラベル',
        index: 'name',
        render: (value: string, item: DataItem) => (
          <div className="mx-4 flex w-full">
            <div className="flex">
              <LabelIcon color={item.color} />
            </div>
            <p className="mx-4">{value}</p>
          </div>
        ),
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '説明',
        index: 'detail',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '',
        index: 'name',
        render: (_: string, item: DataItem) => (
          <div className="flex w-full px-4 py-2 text-center">
            <div className="mx-auto"></div>
            <button
              className="flex rounded-xl border px-2 py-1"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenUpdateModal(Number(item.id))
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
              className="mx-2 flex rounded-xl border px-2 py-1"
              onClick={() => showRemoveConfirmDialog(item)}
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              削除
            </button>
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
    ],
    [handleOpenUpdateModal],
  )

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <div className="w-full">
      <div className="my-4 block w-full text-gray-500">
        <div className="flex w-full bg-main-50 p-4 font-bold">
          <h1>ラベル</h1>
          <div className="mx-auto" />
          <div className="w-42 flex items-center">
            <button
              onClick={() => {
                openModal()
                setSelectedLabel(undefined)
              }}
              className="font-base flex w-full items-center rounded border-2 border-main-200 bg-gray-100 px-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mx-auto size-4 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              ラベルを追加
            </button>
          </div>
        </div>
        <div className="w-full justify-center">
          <Table
            columns={columns}
            data={labels}
            onRowClick={() => {}}
            draggable={true}
            onRowMoved={updateLabelOrder}
          />
        </div>
        <div className="my-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={total}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <CreateLabelModal
        isOpen={showModal}
        onClose={handleClose}
        createLabel={handleCreateLabel}
        label={selectedLabel}
        updateLabel={handleUpdateLabel}
      />
      <CommonModal isOpen={removeModal} onClose={closeRemoveModal}>
        <div className="block w-96 px-4">
          <h1 className="py-4 text-center text-xl font-bold">
            ラベルを削除しますか？
          </h1>
          <label className="my-2">ラベル</label>
          <p className="border border-gray-300 px-2">{selectedLabel?.name}</p>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className="w-[80px] rounded-md border-2 border-main-200 py-1 text-[14px] font-bold text-gray-700"
              onClick={closeRemoveModal}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="w-[60px] rounded-md border-2 border-main-400 bg-main-400 py-1 text-[14px] font-bold text-white"
              onClick={handleDeleteLabel}
            >
              はい
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  )
}

export default LabelList
