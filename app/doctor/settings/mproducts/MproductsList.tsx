'use client'
import Pagination from '@/components/Pagination'
import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import type { Product } from '@/gen/proto/v1/product_pb'
import { deleteProduct, productList, storeProduct } from '@/server/product'
import type { ProductInput } from '@/utils/type'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const basicFormSchema = z.object({
  id: z.union([z.number(), z.null(), z.string(), z.string().length(0)]),
  productName: z.string(),
  category: z.string(),
  price: z.union([z.string(), z.number()]),
  note: z.union([z.string(), z.string().length(0)]),
})

const MproductsList: React.FC = () => {
  // モーダルの表示制御用のステート
  const [showModal, setShowModal] = useState(false)

  const { handleSubmit, register, reset } = useForm<ProductInput>({
    resolver: zodResolver(basicFormSchema),
  })

  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const handleChangePage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const pageSize = 30

  const [currentProduct, setCurrentProduct] = useState<Product>()

  const fetchProduct = useCallback(async () => {
    const res = await productList(currentPage, pageSize)
    setProducts(res.items)
    setTotalPages(Math.ceil(res.total / pageSize))
  }, [currentPage])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const onSubmit: SubmitHandler<ProductInput> = async (data: ProductInput) => {
    try {
      await storeProduct(data)
      await fetchProduct()
      setShowModal(false)
      reset()
    } catch (err) {}
  }

  const updateProductOrder = useMemo(
    () => async (index: number, id: number) => {
      console.log('id is ', id)
      const itemData = products.findLast((i) => Number(i.id) == index)

      await storeProduct({
        id: index,
        sort: id + 1,
        productName: itemData?.productName,
        category: itemData?.category,
        price: itemData?.price,
        note: itemData?.note,
      })
    },
    [products],
  )

  const deleteProductAction = useCallback(
    async (id: number) => {
      const userConfirmed = window.confirm('商品を削除しますか?')
      if (userConfirmed) {
        await deleteProduct(id)
        await fetchProduct()
      }
    },
    [fetchProduct],
  )

  // モーダルを開く関数
  const openModal = () => {
    setShowModal(true)
  }
  const columns = useMemo(
    () => [
      {
        title: '分類',
        index: 'category',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '商品名',
        index: 'productName',
        render: (value: string) => <p className="mx-4">{value}</p>,
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '価格',
        index: 'price',
        render: (value: number) => (
          <p className="w-full text-center">
            ¥{new Intl.NumberFormat('en-US').format(value)}
          </p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '備考',
        index: 'note',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '',
        index: 'id',
        render: (_: string, record: DataItem) => (
          <div className="flex w-full px-4 py-2 text-center">
            <div className="mx-auto"></div>
            <button
              className="flex rounded-xl border px-2 py-1"
              onClick={() => {
                setCurrentProduct(record as Product)
                openModal()
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
              onClick={() => deleteProductAction(record.id)}
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
    [deleteProductAction],
  )

  return (
    <div className="w-full">
      <div className="my-4 block w-full text-gray-500">
        <div className="flex w-full bg-main-50 p-4 font-bold">
          <h1>商品一覧</h1>
          <div className="mx-auto" />
          <div className="w-42 flex items-center">
            <button
              onClick={() => {
                setCurrentProduct(undefined)
                openModal()
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
              商品を追加
            </button>
          </div>
        </div>
        {/* モーダル */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center">
              <div className="z-50 min-w-[500px] rounded-lg bg-main-200 p-8 text-black">
                {/* 編集フォーム */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="block">
                    <div className="flex w-full px-16">
                      <h1 className="mx-auto pb-2 text-xl font-bold">
                        {currentProduct ? '商品編集' : '商品追加'}
                      </h1>
                      <input
                        type="hidden"
                        {...register('id')}
                        value={
                          currentProduct?.id ? Number(currentProduct?.id) : ''
                        }
                      />
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">商品名</label>
                      <div className="flex w-full">
                        <input
                          {...register('productName')}
                          defaultValue={currentProduct?.productName}
                          className="w-1/2 rounded border p-2"
                        />
                      </div>
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">分類</label>
                      <div className="flex w-full">
                        <input
                          {...register('category')}
                          defaultValue={currentProduct?.category}
                          className="w-1/2 rounded border p-2"
                        />
                      </div>
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">価格</label>
                      <input
                        {...register('price')}
                        defaultValue={currentProduct?.price}
                        type="nubmer"
                        className="w-full rounded border p-2"
                      />
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">備考</label>
                      <input
                        {...register('note')}
                        defaultValue={currentProduct?.note}
                        className="w-full rounded border p-2"
                      />
                    </div>

                    <div className="mt-4 flex w-full px-16">
                      <button
                        className="mr-8 w-32  rounded-xl border-2 border-main-400 bg-white p-2"
                        type="button"
                        onClick={() => {
                          reset()
                          setShowModal(false)
                          setCurrentProduct(undefined)
                        }}
                      >
                        戻る
                      </button>
                      <button
                        className="ml-8 w-32  rounded-xl border-2 border-main-400 bg-main-400 p-2 text-white"
                        type="submit"
                      >
                        {currentProduct ? '保存' : '登録'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="w-full justify-center">
          <Table
            columns={columns}
            data={products}
            onRowClick={() => {}}
            draggable={true}
            onRowMoved={updateProductOrder}
          />
        </div>

        {totalPages > 1 && (
          <div className="my-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handleChangePage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MproductsList
