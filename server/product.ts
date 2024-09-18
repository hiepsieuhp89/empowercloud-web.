'use server'

import { ProductService } from '@/gen/proto/v1/product_connect'
import type { ProductInput } from '@/utils/type'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(ProductService, transport)

const productList = async (page: number, size: number) => {
  return withErrorHandling(async () => {
    const response = await client.listProduct({
      page,
      size,
    })
    return {
      items: response.items,
      total: response.totalPage,
    }
  })
}

const storeProduct = async (product: ProductInput) => {
  return withErrorHandling(async () => {
    const response = await client.storeProduct({
      product: {
        id: Number(product.id),
        productName: product.productName,
        category: product.category,
        price: Number(product.price),
        note: product.note,
        sort: product.sort,
      },
    })
    return response
  })
}

const deleteProduct = async (id: number) => {
  return withErrorHandling(async () => {
    const response = await client.deleteProduct({ id })
    return response
  })
}

export { deleteProduct, productList, storeProduct }
