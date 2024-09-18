import { messagingApi, middleware, validateSignature } from '@line/bot-sdk'
const { MessagingApiClient } = messagingApi

const lineConfig = {
  channelAccessToken: process.env.LINE_CHATBOT_CHANNEL_ACCESS_TOKEN || 'token',
  channelSecret: process.env.LINE_CHATBOT_CHANNEL_SECRET || 'secret',
}

const lineMiddleware = middleware(lineConfig)

const lineClient = new MessagingApiClient(lineConfig)

function validateSignatureLine(body: string | Buffer, sign: string) {
  return validateSignature(body, lineConfig.channelSecret, sign)
}

export { lineClient, lineMiddleware, validateSignatureLine }
