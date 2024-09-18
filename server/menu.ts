'use server'

import { ListMenuService } from '@/gen/proto/v1/menu_connect'
import type { MenuItem } from '@/gen/proto/v1/menu_pb'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(ListMenuService, transport)

async function listMenu(clinicId?: number) {
  return withErrorHandling(async () => {
    const response = await client.listMenu({
      clinicId,
    })
    return {
      items: response.items,
    }
  })
}

async function updateMenus(params: MenuItem[]) {
  return withErrorHandling(async () => {
    await client.storeMenu({ menus: params })
    return {
      status: 'OK',
    }
  })
}

export { listMenu, updateMenus }
