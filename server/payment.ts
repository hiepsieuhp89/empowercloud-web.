'use server'

import { PaymentService } from '@/gen/proto/v1/payment_connect'
import type { PaymentSource } from '@/utils/type'
import { createPromiseClient } from '@connectrpc/connect'
import { transport, withErrorHandling } from './api'

const client = createPromiseClient(PaymentService, transport)

const checkoutSession = async (
  orderId: string,
  role: PaymentSource,
  orderableType: string,
) => {
  return withErrorHandling(async () => {
    let successUrl, cancelUrl, paymentType: string

    switch (role) {
      case 'patient':
        successUrl = `${process.env.NEXTAUTH_URL}/patient/reception?session_id={CHECKOUT_SESSION_ID}`
        cancelUrl = `${process.env.NEXTAUTH_URL}/home?id=${orderId}`
        paymentType = 'patient'
        break
      case 'line':
        successUrl = `${process.env.NEXTAUTH_URL}/payment/success?id=${orderId}&session_id={CHECKOUT_SESSION_ID}`
        cancelUrl = `${process.env.NEXTAUTH_URL}/payment/cancel?id=${orderId}`
        paymentType = 'line'
        break
      default:
        successUrl = `${process.env.NEXTAUTH_URL}/doctor/patient/reception?id=${orderId}&session_id={CHECKOUT_SESSION_ID}`
        cancelUrl = `${process.env.NEXTAUTH_URL}/doctor/reception?id=${orderId}`
        paymentType = 'admin'
    }

    const response = await client.checkoutSession({
      orderId,
      successUrl,
      cancelUrl,
      paymentType,
      orderableType,
    })
    return response.paymentUrl
  })
}

const verifyPayment = async (sessionId: string) => {
  return withErrorHandling(async () => {
    const response = await client.verifyPayment({ sessionId })
    return response.orderId
  })
}

interface PaymentListParams {
  page: number
  size: number
  paymentSource: string
  paymentType: string
  search: string
}

const listPayments = async (params: PaymentListParams) => {
  return withErrorHandling(async () => {
    const response = await client.getPaymentHistory(params)
    return {
      payments: response.payments,
      total: response.totalPage,
      size: response.size,
      page: response.currentPage,
    }
  })
}

const detailPayment = async (id: number) => {
  return withErrorHandling(async () => {
    const response = await client.getPaymentDetail({ id })
    return {
      payment: response.payment,
    }
  })
}

export { checkoutSession, detailPayment, listPayments, verifyPayment }
