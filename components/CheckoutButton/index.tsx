import { checkoutSession } from '@/server/payment'
import type { PaymentSource } from '@/utils/type'
import React from 'react'

interface CheckoutParams {
  orderId: string
  source?: PaymentSource
}
const CheckoutButton: React.FC<CheckoutParams> = ({ orderId, source }) => {
  const handleCheckout = async () => {
    // TODO: remove hard coded values
    const res = await checkoutSession(orderId, source || 'admin', 'reception')
    window.location.href = res
  }

  return (
    <button
      className="w-16 rounded border bg-status-4 px-4 py-2 text-white hover:bg-red-700"
      onClick={(event) => {
        event.stopPropagation()
        handleCheckout()
      }}
    >
      会計
    </button>
  )
}

export default CheckoutButton
