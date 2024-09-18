export type Examination = {
  id: number
  name: string
}

export const examinations: Examination[] = [
  {
    id: 1,
    name: '全切開二重術',
  },
  {
    id: 2,
    name: '白玉点滴',
  },
  {
    id: 3,
    name: '化粧品購入',
  },
  {
    id: 4,
    name: 'ボットクス注射',
  },
]

export type PositionRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'reception'
  | 'web'
  | 'support'
  | undefined
  | ''

export const PositionRoleList: PositionRole[] = [
  'admin',
  'doctor',
  'nurse',
  'reception',
  'web',
  'support',
]

export function getPositionName(position: PositionRole) {
  switch (position) {
    case 'admin':
      return '管理者'
    case 'doctor':
      return '医師'
    case 'nurse':
      return 'ナース'
    case 'reception':
      return '受付カウンセラー'
    case 'web':
      return 'WEB担当'
    case 'support':
      return '看護助手'
    default:
      return '-'
  }
}

export type LoginTypeRole = 'admin' | 'doctor' | 'patient' | undefined | ''
export const AdminTypeRole: LoginTypeRole[] = ['admin', 'doctor']
export function getLoginTypeName(type: LoginTypeRole) {
  switch (type) {
    case 'admin':
      return 'システム管理者'
    case 'doctor':
      return '店舗管理者'
    default:
      return '-'
  }
}

export function convertStatusToText(value: number) {
  let statusName = ''
  switch (value) {
    case 1:
      // waiting for order
      statusName = '受付待ち'
      break
    case 2:
      // wait for examination
      statusName = '診察待ち'
      break
    case 3:
      // examinating
      statusName = '診察中'
      break
    case 4:
      // waiting for payment
      statusName = '会計待ち'
      break
    case 5:
      // paid
      statusName = '会計完了'
      break
    default:
      statusName = '-'
    // code block executed if expression doesn't match any case
  }
  return statusName
}

export function convertStatusToClass(value: number) {
  let cssClass = ''
  switch (value) {
    case 1:
      // waiting for order
      cssClass = 'bg-status-1'
      break
    case 2:
      // wait for examination
      cssClass = 'bg-status-2'
      break
    case 3:
      // examinating
      cssClass = 'bg-status-3'
      break
    case 4:
      // waiting for payment
      cssClass = 'bg-status-4'
      break
    case 5:
      // paid
      cssClass = 'bg-status-5'
      break
    default:
      cssClass = 'bg-gray-500'
    // code block executed if expression doesn't match any case
  }
  return cssClass
}
