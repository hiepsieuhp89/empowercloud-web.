'use server'

import { EffectMedicineListService } from '@/gen/proto/v1/effect_medicine_connect'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

interface MedicineListParams {
  page: number
}
const client = createPromiseClient(EffectMedicineListService, transport)

async function effectMedicineList(params: MedicineListParams) {
  return withErrorHandling(async () => {
    const { page } = params

    const response = await client.effectMedicineList({
      page,
    })
    return {
      medicines: response.medicines,
      page: response.currentPage,
      total: response.totalPage,
    }
  })
}

export { effectMedicineList }
