/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

interface Column {
  className: any
  title: any
  index: any
  sorter?: (a: any, b: any) => number // Ideally, replace 'any' with a more specific type based on your data structure
  render?: (value: any, record: any) => React.ReactNode // Similarly, replace 'any' with specific types
}

interface DataItem {
  [key: string]: any // Replace 'any' with specific types based on your data items
}

interface TableProps {
  columns: Column[]
  data: DataItem[]
  onRowClick?: (rowId: any) => void
  headerClass?: string
}

const TableCalendar: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick,
  headerClass = 'bg-white',
}) => {
  const [indexSort, setIndexSort] = useState<number | undefined>(undefined)
  const [isAscending, setIsAscending] = useState<boolean | undefined>(undefined)
  const [tableData, setTableData] = useState<DataItem[]>([])

  useEffect(() => {
    if (indexSort) {
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
  return (
    <table className="w-full border-separate border-spacing-0">
      <thead className={`sticky top-0 z-10 w-full ${headerClass}`}>
        <tr className="w-full">
          {columns.map((d, index) => (
            <th className={`${d.className}`} key={index}>
              <div className="flex items-center justify-center">
                <div dangerouslySetInnerHTML={{ __html: d.title }}></div>
                {d.sorter && (
                  <div className="flex h-full flex-col">
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
          <tr
            className={`border-gray w-full border transition-colors duration-300 ${onRowClick ? 'hover:cursor-pointer hover:bg-primary-admin' : ''}`}
            onClick={() => (onRowClick ? onRowClick(d.id) : {})}
            key={index}
          >
            {columns.map((_d, _index) => (
              <td className={`${_d.className}`} key={_index}>
                {_d.render ? _d.render(d[_d.index], d) : d[_d.index]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TableCalendar
