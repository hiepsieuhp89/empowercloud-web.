import { lineClient, validateSignatureLine } from '@/lib/line'
import { clinicList } from '@/server/clinic'
import { listMenu } from '@/server/menu'
import { checkoutSession } from '@/server/payment'
import {
  createReception,
  getScheduleReception,
  updateReception,
} from '@/server/reception'
import type { Message, WebhookEvent } from '@line/bot-sdk'
import { NextResponse } from 'next/server'

function isValidBody(body?: string | Buffer) {
  return (body && typeof body === 'string') || Buffer.isBuffer(body)
}

function chunkArray<T>(array: T[], size: number): T[][] {
  return array.reduce((acc: T[][], _, index: number) => {
    const chunkIndex = Math.floor(index / size)
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [] // start a new chunk
    }
    acc[chunkIndex].push(array[index])
    return acc
  }, [])
}

async function handleEvent(req: Request) {
  const handleCheckout = async (orderId: string) => {
    const url = await checkoutSession(orderId, 'line', 'reception')
    return url
  }

  const res = new NextResponse('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  })

  try {
    const signature = req.headers.get('x-line-signature') as string
    const textData = await req.text()
    const body = await (async (): Promise<string | Buffer> => {
      if (isValidBody(textData)) {
        return textData
      } else {
        throw new Error('Invalid body')
      }
    })()

    if (!validateSignatureLine(body, signature)) {
      throw new Error('Invalid Request')
    }

    const strBody = Buffer.isBuffer(body) ? body.toString() : body
    const bodyJson = JSON.parse(strBody)
    const event: WebhookEvent = bodyJson.events[0]

    const lineUserId = event.source.userId
    //TODO: verify line login user by generating jwt token

    if (event.type == 'postback') {
      const postbackData = event.postback.data
      const paramsData = new URLSearchParams(postbackData)

      if (paramsData.get('action') === 'cancel') {
        // Handle cancellation
        const receptionId = paramsData.get('id') || '0'
        await updateReception(BigInt(receptionId), 10)
        await lineClient.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '予約がキャンセルされました。',
            },
          ],
        })
      } else if (paramsData.get('action') === 'change') {
        // Handle change
        await lineClient.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '予約を変更します。再度予約をお願いします。',
              quickReply: {
                items: [
                  {
                    type: 'action',
                    action: {
                      type: 'postback',
                      label: '新規予約',
                      data: 'new_schedule=新規予約',
                    },
                  },
                ],
              },
            },
          ],
        })
      } else if (!paramsData.get('clinic')) {
        const response = await clinicList('', 1, 10)
        const clinics = response.clinics
        if (paramsData.get('new_schedule') == '新規予約') {
          //TODO init new schedule for user
          await lineClient.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: '病院を選択してください?',
                quickReply: {
                  items: clinics.map((i) => ({
                    type: 'action',
                    action: {
                      type: 'postback',
                      label: i.name,
                      data: 'clinic=' + encodeURIComponent(i.id), //'schedule_id=1' +
                    },
                  })),
                },
              },
            ],
          })
        } else {
          await lineClient.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: 'ありがとうございます。',
              },
            ],
          })
        }
      } else if (!paramsData.get('examination')) {
        const clinicId = Number(paramsData.get('clinic'))
        const response = await listMenu(clinicId)

        if (!paramsData.get('menu1')) {
          let examinationCategories = response.items.map(
            (i) => i.examinationCategory,
          )
          const examinationCategoriesSet = new Set(examinationCategories)
          examinationCategories = Array.from(examinationCategoriesSet)

          const chunks = chunkArray(examinationCategories, 10)

          const messages = chunks.map((chunk) => {
            const examinationMessage: Message = {
              type: 'template',
              altText: '診察カテゴリーを選択してください',
              template: {
                type: 'carousel',
                columns: chunk.map((category) => ({
                  thumbnailImageUrl: `${process.env.NEXTAUTH_URL}/empowerme_logo2405.png`, // Replace with an appropriate thumbnail URL
                  title: '診察カテゴリー',
                  text: category,
                  type: 'action',
                  actions: [
                    {
                      type: 'postback',
                      label: '決定',
                      data: `${event.postback.data}&menu1=${encodeURIComponent(category)}`,
                    },
                  ],
                })),
              },
            }
            return examinationMessage
          })

          await lineClient.replyMessage({
            replyToken: event.replyToken,
            messages,
          })
        } else if (!paramsData.get('menu2')) {
          const menu1 = paramsData.get('menu1') || ''
          let majorCategory = response.items
            .filter((i) => i.examinationCategory == menu1)
            .map((i) => i.majorCategory)
          const majorCategorySet = new Set(majorCategory)
          majorCategory = Array.from(majorCategorySet)

          const chunks = chunkArray(majorCategory, 10)

          const messages = chunks.map((chunk) => {
            const majorMessage: Message = {
              type: 'template',
              altText: '大カテゴリーを選択してください',
              template: {
                type: 'carousel',
                columns: chunk.map((category) => ({
                  thumbnailImageUrl: `${process.env.NEXTAUTH_URL}/empowerme_logo2405.png`, // Replace with an appropriate thumbnail URL
                  title: '大カテゴリー',
                  text: category,
                  type: 'action',
                  actions: [
                    {
                      type: 'postback',
                      label: '決定',
                      data: `${event.postback.data}&menu2=${encodeURIComponent(category)}`,
                    },
                  ],
                })),
              },
            }
            return majorMessage
          })
          await lineClient.replyMessage({
            replyToken: event.replyToken,
            messages,
          })
        } else {
          const menu1 = paramsData.get('menu1') || ''
          const menu2 = paramsData.get('menu2') || ''

          const minorCategory = response.items.filter(
            (i) => i.examinationCategory === menu1 && i.majorCategory === menu2,
          )

          const chunks = chunkArray(minorCategory, 10)

          const messages = chunks.map((chunk) => {
            const message: Message = {
              type: 'template',
              altText: '小カテゴリーを選択してください',
              template: {
                type: 'carousel',
                columns: chunk.map((category) => ({
                  thumbnailImageUrl: `${process.env.NEXTAUTH_URL}/empowerme_logo2405.png`, // Replace with an appropriate thumbnail URL
                  title: '小カテゴリー',
                  text: category.minorCategory,
                  type: 'action',
                  actions: [
                    {
                      type: 'postback',
                      label: '決定',
                      data: `clinic=${paramsData.get('clinic')}&examination=${encodeURIComponent(category.id)}`,
                    },
                  ],
                })),
              },
            }
            return message
          })
          await lineClient.replyMessage({
            replyToken: event.replyToken,
            messages,
          })
        }
      } else if (!paramsData.get('doctor')) {
        const menuId = Number(paramsData.get('examination'))
        const response = await getScheduleReception(menuId)
        const doctors = response.doctors

        const chunks = chunkArray(doctors, 10)

        const messages = chunks.map((chunk) => {
          const message: Message = {
            type: 'template',
            altText: '医師を選択してください',
            template: {
              type: 'carousel',
              columns: chunk.map((i) => ({
                thumbnailImageUrl: `${process.env.NEXTAUTH_URL}/empowerme_logo2405.png`, // Replace with an appropriate thumbnail URL
                title: '医師',
                text: i.name,
                type: 'action',
                actions: [
                  {
                    type: 'postback',
                    label: '決定',
                    data: `${event.postback.data}&doctor=${encodeURIComponent(i.id)}`,
                  },
                ],
              })),
            },
          }
          return message
        })
        await lineClient.replyMessage({
          replyToken: event.replyToken,
          messages,
        })
      } else if (!paramsData.get('date')) {
        const menuId = Number(paramsData.get('examination'))
        const doctorId = Number(paramsData.get('doctor'))
        const response = await getScheduleReception(menuId, doctorId)
        const dates = response.dates

        const chunks = chunkArray(dates, 10)

        const messages = chunks.map((chunk) => {
          const message: Message = {
            type: 'template',
            altText: '月日を選択してください',
            template: {
              type: 'carousel',
              columns: chunk.map((i) => ({
                thumbnailImageUrl: `${process.env.NEXTAUTH_URL}/empowerme_logo2405.png`, // Replace with an appropriate thumbnail URL
                title: '月日を選択',
                text: i,
                type: 'action',
                actions: [
                  {
                    type: 'postback',
                    label: '決定',
                    data: `${event.postback.data}&date=${encodeURIComponent(i)}`,
                  },
                ],
              })),
            },
          }
          return message
        })
        await lineClient.replyMessage({
          replyToken: event.replyToken,
          messages,
        })
      } else if (!paramsData.get('time')) {
        const menuId = Number(paramsData.get('examination'))
        const doctorId = Number(paramsData.get('doctor'))
        const date = paramsData.get('date') || ''
        const response = await getScheduleReception(menuId, doctorId, date)
        const times = response.scheduleTime

        if (!paramsData.get('hour')) {
          const chunks = chunkArray(
            Array.from(new Set(times.map((i) => i.split(':')[0]))),
            10,
          )
          const messages = chunks.map((chunk) => {
            const message: Message = {
              type: 'template',
              altText: '時間を選択してください',
              template: {
                type: 'carousel',
                columns: chunk.map((i) => ({
                  thumbnailImageUrl: `${process.env.NEXTAUTH_URL}/${Number(i) < 12 ? 'time_1' : Number(i) < 18 ? 'time_2' : 'time_3'}.png`, // Replace with an appropriate thumbnail URL
                  title: '時間を選択',
                  text: `${i}時ごろ`,
                  type: 'action',
                  actions: [
                    {
                      type: 'postback',
                      label: '決定',
                      data: `${event.postback.data}&hour=${encodeURIComponent(i)}`,
                    },
                  ],
                })),
              },
            }
            return message
          })
          await lineClient.replyMessage({
            replyToken: event.replyToken,
            messages,
          })
        } else {
          const hour = paramsData.get('hour')
          const chunks = chunkArray(
            times.filter((i) => i.includes(`${hour}:`)),
            10,
          )
          const messages = chunks.map((chunk) => {
            const message: Message = {
              type: 'template',
              altText: '時間を選択してください',
              template: {
                type: 'carousel',
                columns: chunk.map((i) => ({
                  thumbnailImageUrl: `${process.env.NEXTAUTH_URL}/${Number(i.split(':')[0]) < 12 ? 'time_1' : Number(i.split(':')[0]) < 18 ? 'time_2' : 'time_3'}.png`, // Replace with an appropriate thumbnail URL
                  title: '時間を選択',
                  text: i,
                  type: 'action',
                  actions: [
                    {
                      type: 'postback',
                      label: '決定',
                      data: `${event.postback.data}&time=${encodeURIComponent(i)}`,
                    },
                  ],
                })),
              },
            }
            return message
          })
          await lineClient.replyMessage({
            replyToken: event.replyToken,
            messages,
          })
        }
      } else {
        const examinationId = Number(paramsData.get('examination'))
        const doctorId = Number(paramsData.get('doctor'))
        const date = paramsData.get('date') || ''
        const time = paramsData.get('time') || ''
        // TODO: get memberId from line's user
        const receptionId = await createReception({
          examinationId,
          doctorId,
          appointmentTime: `${date}T${time}`,
          memoContent: '',
          firstName: '',
          lastName: '',
          firstNameFurigana: '',
          lastNameFurigana: '',
          phoneNumber: '',
          birthDate: `1900-01-01`,
          lineId: lineUserId,
        })

        const clinicId = Number(paramsData.get('clinic'))
        const menuResponse = await listMenu(clinicId)
        const menu = menuResponse.items.findLast((i) => i.id == examinationId)

        const clinicResponse = await clinicList('', 1, 10)
        const clinic = clinicResponse.clinics.findLast((i) => i.id == clinicId)

        const redirectUrl = await handleCheckout(String(receptionId))
        await lineClient.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: `メニュー: ${menu?.minorCategory}`,
            },
            {
              type: 'template',
              altText: clinic?.name || '-',
              template: {
                type: 'buttons',
                //thumbnailImageUrl: `${process.env.NEXTAUTH_URL}/empowerme_logo2405.png`,
                //imageAspectRatio: 'rectangle',
                //imageSize: 'cover',
                title: clinic?.name || '-',
                text: `時間: ${paramsData.get('date')} ${paramsData.get('time')}\n価格: ${menu?.price.toLocaleString('en-US')}円`,
                actions: [
                  {
                    type: 'uri',
                    label: '決済',
                    uri: redirectUrl || '',
                  },
                  {
                    type: 'postback',
                    label: 'キャンセル',
                    data: `action=cancel&id=${receptionId}`, // + encodeURIComponent('新規予約'),
                  },
                ],
              },
            },
          ],
        })
      }
    } else if (event.type == 'message') {
      const answers = ['いいえ', '新規予約']
      await lineClient.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: '診察予約しますか？',
            quickReply: {
              items: answers.map((i) => ({
                type: 'action',
                action: {
                  type: 'postback',
                  label: i,
                  data: 'new_schedule=' + encodeURIComponent(i),
                },
              })),
            },
          },
        ],
      })
    }
  } catch (e) {
    console.error('error', e)
  }
  return res
}

export async function POST(_req: Request) {
  return handleEvent(_req)
}
