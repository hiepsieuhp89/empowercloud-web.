const _messageValidatePassword = {
  password: {
    notInput: 'パスワードは必ず入力してください。',
    failRegex: 'パスワード8~32桁で入力してください。',
  },
  newPassword: {
    notInput: '新しいパスワードは必ず入力してください。',
    failRegex: '新しいパスワードは、8文字〜24文字以内で入力してください。',
  },
}
const _messageValidateName = {
  nickName: 'ニックネーム',
  firstName: '姓',
  lastName: '名',
  companyName: '会社名',
  departmentName: '部署名',
}
const _regexName = /^[a-zA-Zａ-ｚA-Z0-9 ぁ-んァ-ヶー一-龠々]+$/
const _regexCompanyCode = /(^(\d{4})+$)/
const _regexNameKatakana = /^([ァ-ン]|ー)+$/
const _regexPassword = /^[0-9a-zA-Zぁ-んァ-ヶー一-龠々]{8,32}$/
const _regexTelPhone = /(^(\d{7,11})+$)/
//eslint-disable-next-line
const _regexEmail =
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
