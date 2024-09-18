/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

interface Column {
  className: string
  title: string
  index: string | number
  sorter?: (a: any, b: any) => number
  render?: (value: any, record: DataItem) => React.ReactNode
}

export interface DataItem {
  [key: string]: any
}

interface TableProps {
  columns: Column[]
  data: DataItem[]
  onRowClick?: (rowId: any) => void
  onRowMoved?: (id: number, sort: number) => void
  headerClass?: string
  mainID?: number
  draggable?: boolean
}

interface DragItem {
  index: number
  id: string
  type: string
}

const Row: React.FC<{
  index: number
  moveRow: (dragIndex: number, hoverIndex: number) => void
  id: any
  onRowClick?: (rowId: any) => void
  columns: Column[]
  data: DataItem
  draggable: boolean
  onRowMoved?: (id: number, sort: number) => void
}> = ({
  index,
  moveRow,
  id,
  onRowClick,
  columns,
  data,
  draggable,
  onRowMoved,
}) => {
  const ref = useRef<HTMLTableRowElement>(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'row',
    collect: (monitor: DropTargetMonitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveRow(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    drop: (item: DragItem) => {
      if (onRowMoved) {
        onRowMoved(data.id, item.index)
      }
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'row',
    item: () => {
      return { id, index }
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  if (draggable) {
    drag(drop(ref))
  }

  return (
    <tr
      ref={ref}
      data-handler-id={handlerId}
      className={`border-gray w-full border transition-colors duration-300 ${onRowClick ? 'hover:cursor-pointer hover:bg-primary-admin' : ''}`}
      onClick={() => (onRowClick ? onRowClick(id) : {})}
      style={{ opacity: isDragging ? 0 : 1 }}
    >
      {columns.map((_d, _index) => (
        <td className={`${_d.className}`} key={_index}>
          {_d.render ? _d.render(data[_d.index], data) : data[_d.index]}
        </td>
      ))}
    </tr>
  )
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick,
  headerClass = 'bg-white',
  onRowMoved,
  draggable = false,
}) => {
  const [indexSort, setIndexSort] = useState<number | undefined>(undefined)
  const [isAscending, setIsAscending] = useState<boolean | undefined>(undefined)
  const [tableData, setTableData] = useState<DataItem[]>([])

  useEffect(() => {
    if (indexSort !== undefined) {
      const newData = data.sort((a, b) => {
        const sorterFunction = columns[indexSort - 1].sorter
        if (!sorterFunction) {
          return 0
        }
        if (isAscending) {
          return sorterFunction(
            a[columns[indexSort - 1].index],
            b[columns[indexSort - 1].index],
          )
        } else {
          return sorterFunction(
            b[columns[indexSort - 1].index],
            a[columns[indexSort - 1].index],
          )
        }
      })
      setTableData([...newData])
    } else {
      setTableData(data)
    }
  }, [indexSort, data, columns, isAscending])

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = tableData[dragIndex]
      const newTableData = [...tableData]
      newTableData.splice(dragIndex, 1)
      newTableData.splice(hoverIndex, 0, dragRow)
      setTableData(newTableData)
    },
    [tableData],
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <table className="w-full border-separate border-spacing-0">
        <thead className={`sticky top-0 z-10 w-full ${headerClass}`}>
          <tr className="w-full">
            {columns.map((d, index) => (
              <th className={`${d.className}`} key={index}>
                <div className="flex items-center justify-center">
                  <div dangerouslySetInnerHTML={{ __html: d.title }}></div>
                  {d.sorter && (
                    <div className="ml-2 flex h-full flex-col">
                      <button
                        className={`w-4 cursor-pointer ${!isAscending && indexSort === index + 1 && 'text-primary'}`}
                        onClick={() => {
                          if (!isAscending && indexSort === index + 1) {
                            setIndexSort(undefined)
                          } else {
                            setIndexSort(index + 1)
                            setIsAscending(false)
                          }
                        }}
                      >
                        <svg
                          width="4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      </button>
                      <button
                        className={`w-4 cursor-pointer ${isAscending && indexSort === index + 1 && 'text-primary'}`}
                        onClick={() => {
                          if (isAscending && indexSort === index + 1) {
                            setIndexSort(undefined)
                          } else {
                            setIndexSort(index + 1)
                            setIsAscending(true)
                          }
                        }}
                      >
                        <svg
                          width="4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="w-full" style={{ fontSize: '12px' }}>
          {tableData?.map((d, index) => (
            <Row
              key={index}
              index={index}
              moveRow={moveRow}
              id={d.id}
              onRowClick={onRowClick}
              columns={columns}
              data={d}
              draggable={draggable}
              onRowMoved={onRowMoved}
            />
          ))}
        </tbody>
      </table>
    </DndProvider>
  )
}

export default Table
