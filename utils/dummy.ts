import { Questionaire } from '@/gen/proto/v1/questionaire_pb'
import { fakerJA as faker } from '@faker-js/faker'
import { addDays, format } from 'date-fns'

const generateMenuDummyData = () => {
  return [
    {
      id: 1,
      examination_category: '美容外科(美容整形)',
      major_category: '目・二重整形',
      minor_category:
        '眼瞼下垂手術,目頭切開,埋没法(糸のみで行う方法),埋没法抜去,他院修正',
      body_part_category: '目頭,上瞼',
      price: 0,
    },
    {
      id: 2,
      examination_category: '美容外科(美容整形)',
      major_category: '目・くま取り',
      minor_category:
        '二重埋没法,二重全切開,くま治療,ヒアルロン酸注射(涙袋形成),眼瞼下垂,目尻切開法,目頭切開法,眉下リフト（眉下切開）,下眼瞼下制 (皮膚切開法),アスフレックス,他院修正',
      body_part_category: '下瞼',
      price: 0,
    },
    {
      id: 3,
      examination_category: '美容外科(美容整形)',
      major_category: '鼻',
      minor_category:
        'ヒアルロン酸注射(鼻筋形成),隆鼻術,鼻先異物除去（オステオポールなど）,他院修正',
      body_part_category: '小鼻,鼻筋',
      price: 0,
    },
    {
      id: 4,
      examination_category: '美容外科(美容整形)',
      major_category: '口',
      minor_category:
        'ヒアルロン酸注射(唇形成),アートメイク,ガミースマイル治療,医療脱毛(ヒゲ),他院修正',
      body_part_category: '唇,ヒゲ,ほうれい線',
      price: 0,
    },
    {
      id: 5,
      examination_category: '美容外科(美容整形)',
      major_category: '輪郭・オトガイ形成',
      minor_category:
        '医療ハイフ,糸リフト,脂肪溶解注射,カベリン,医療痩身,ヒアルロン酸注射(あご形成),オトガイ形成,他院修正',
      body_part_category: '輪郭',
      price: 0,
    },
    {
      id: 6,
      examination_category: '美容外科(美容整形)',
      major_category: '豊胸',
      minor_category:
        '脂肪注入豊胸,シリコンバッグ豊胸,ヒアルロン酸豊胸,他院修正',
      body_part_category: '胸',
      price: 0,
    },
    {
      id: 7,
      examination_category: '美容外科(美容整形)',
      major_category: '婦人科形成',
      minor_category:
        '小陰唇縮小術,大陰唇縮小術,陰核包茎術,副皮除去術,大陰唇たるみとり術',
      body_part_category: '女性器',
      price: 0,
    },
    {
      id: 8,
      examination_category: '美容皮膚科',
      major_category: 'シミ取り',
      minor_category:
        'ピコレーザートーニング,フォトRF,レーザートーニング,レーザー治療,光治療,水光注射,フォトフェイシャル,ルメッカ,フラクトラ',
      body_part_category: '全顔、体、VIO',
      price: 0,
    },
    {
      id: 9,
      examination_category: '美容皮膚科',
      major_category: '脱毛',
      minor_category:
        '熱破壊式医療脱毛,蓄熱式医療脱毛,ニードル脱毛（医療針脱毛）,LEDサロン脱毛,光サロン脱毛',
      body_part_category: '全顔、体、VIO',
      price: 0,
    },
    {
      id: 10,
      examination_category: '美容皮膚科',
      major_category: 'ほくろ取り',
      minor_category: 'レーザー治療,切除',
      body_part_category: '全顔、体、VIO',
      price: 0,
    },
    {
      id: 11,
      examination_category: '美容皮膚科',
      major_category: 'ハイフ',
      minor_category: 'ドットハイフ,ハイフシャワー,リニアハイフ',
      body_part_category: '全顔',
      price: 0,
    },
    {
      id: 12,
      examination_category: '美容皮膚科',
      major_category: '美容点滴・注射',
      minor_category: '白玉点滴,白玉注射,NMN点滴,プラセンタ注射',
      body_part_category: '体',
      price: 0,
    },
    {
      id: 13,
      examination_category: '美容皮膚科',
      major_category: 'ドクターズコスメ',
      minor_category: 'CBD',
      body_part_category: '顔',
      price: 0,
    },
    {
      id: 14,
      examination_category: '美容皮膚科',
      major_category: 'バスト',
      minor_category: 'バストトップの黒ずみ治療',
      body_part_category: '胸',
      price: 0,
    },
    {
      id: 15,
      examination_category: '美容皮膚科',
      major_category: 'AGA',
      minor_category: '男性、女性',
      body_part_category: '頭',
      price: 0,
    },
    {
      id: 16,
      examination_category: '美容皮膚科',
      major_category: 'ED',
      minor_category: 'ED',
      body_part_category: '男性器',
      price: 0,
    },
    {
      id: 17,
      examination_category: '美容皮膚科',
      major_category: '婦人科形成',
      minor_category: '小陰唇縮小術,大陰唇縮小術',
      body_part_category: '女性器',
      price: 0,
    },
    {
      id: 18,
      examination_category: '美容皮膚科',
      major_category: '痩身',
      minor_category:
        '脂肪吸引,トゥルースカルプiD,ボトックス痩身/ボツリヌストキシン痩身,ラクやせ外来（サクセンダ）,ダイエットピル,トゥルースカルプflex,クールスカルプティング® エリート（クルスカダブル）,ヴァンキッシュME®,食欲抑制剤',
      body_part_category: '体',
      price: 0,
    },
    {
      id: 19,
      examination_category: '美容皮膚科',
      major_category: 'ワキガ・多汗症治療',
      minor_category:
        'ボトックス・韓国製ボツリヌストキシン,ミラドライ,シェービング法,ベイザーシェービング法,完全摘出法,すそワキガ,シェービング法,根こそぎベイザーシェービング',
      body_part_category: '脇',
      price: 0,
    },
    {
      id: 20,
      examination_category: '美容皮膚科',
      major_category: 'アートメイク',
      minor_category: '医療アートメイク・アートヘア',
      body_part_category: '歯',
      price: 0,
    },
    {
      id: 21,
      examination_category: '審美歯科',
      major_category: 'インプラント',
      minor_category: 'インプラント',
      body_part_category: '歯',
      price: 0,
    },
    {
      id: 22,
      examination_category: '審美歯科',
      major_category: '歯科ホワイトニング',
      minor_category: '歯科ホワイトニング',
      body_part_category: '歯',
      price: 0,
    },
    {
      id: 23,
      examination_category: '審美歯科',
      major_category: '親知らず抜歯',
      minor_category: '親知らず抜歯',
      body_part_category: '歯',
      price: 0,
    },
    {
      id: 24,
      examination_category: '眼科',
      major_category: '視力回復',
      minor_category: 'レーシック,ICL',
      body_part_category: '目',
      price: 0,
    },
    {
      id: 25,
      examination_category: 'ホワイトニング',
      major_category: 'LEDホワイトニング',
      minor_category: 'LEDホワイトニング',
      body_part_category: '歯',
      price: 0,
    },
    {
      id: 26,
      examination_category: '医療用ウィッグ',
      major_category: '医療用ウィッグ',
      minor_category: '既製品,セミオーダー,フルオーダー,人毛,ミックス毛,人工毛',
      body_part_category: '髪',
      price: 0,
    },
    {
      id: 27,
      examination_category: '医療用ウィッグ',
      major_category: '医療用ウィッグケア',
      minor_category:
        'ウィッグシャンプー,ウィッグコンディショナー,ウイッグネット,ウイッグスタンド,ウイッグデオドラント,ウィッグミスト',
      body_part_category: '髪',
      price: 0,
    },
    {
      id: 28,
      examination_category: '医療用ウィッグ',
      major_category: '医療用帽子',
      minor_category: '医療用帽子',
      body_part_category: '髪',
      price: 0,
    },
  ]
}
const generateShiftDetailDummyData = (date: Date) => {
  const currentDate = new Date(date)

  // Get the year and month
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  // Get the number of days in the month
  const numberOfDays = new Date(year, month + 1, 0).getDate()
  // Create an array to store the date-time values of the month
  const dateTimesOfMonth: string[] = []

  // Loop through each day of the month and push date-time values into the array
  for (let day = 1; day <= numberOfDays; day++) {
    const dateTime = new Date(year, month, day) // Date without time (midnight)
    dateTimesOfMonth.push(format(dateTime, 'yyyy-MM-dd'))
  }

  const data: { name: string; office: string; shift: number[] }[] = []
  //for (let i = 1; i < 6; i++) {
  data.push({
    //name: faker.person.firstName(),
    name: '仲田力次',
    office: 'ドクター',
    //office: faker.person.firstName(),
    shift: dateTimesOfMonth.map(() => {
      const randVal = Math.random()
      return randVal < 0.2
        ? 0
        : randVal < 0.4
          ? 1
          : randVal < 0.6
            ? 2
            : randVal < 0.8
              ? 3
              : 4
    }),
  })
  data.push({
    //name: faker.person.firstName(),
    name: '仲田真妃',
    office: 'ナース',
    //office: faker.person.firstName(),
    shift: dateTimesOfMonth.map(() => {
      const randVal = Math.random()
      return randVal < 0.2
        ? 0
        : randVal < 0.4
          ? 1
          : randVal < 0.6
            ? 2
            : randVal < 0.8
              ? 3
              : 4
    }),
  })
  data.push({
    //name: faker.person.firstName(),
    name: '与古田沙希',
    office: '管理者',
    //office: faker.person.firstName(),
    shift: dateTimesOfMonth.map(() => {
      const randVal = Math.random()
      return randVal < 0.2
        ? 0
        : randVal < 0.4
          ? 1
          : randVal < 0.6
            ? 2
            : randVal < 0.8
              ? 3
              : 4
    }),
  })
  //}

  return { data, dates: dateTimesOfMonth }
}

const generateShiftMasterDummyData = () => {
  return [
    {
      name: 'A',
      color: '#f5c4c6',
      attendance: ['10:00', '19:00'],
      breaks: [
        ['13:30', '14:00'],
        ['17:30', '18:00'],
      ],
    },
    {
      name: 'B',
      color: '#bcdcf2',
      attendance: ['11:00', '20:00'],
      breaks: [
        ['12:30', '13:00'],
        ['17:30', '18:00'],
      ],
    },
    {
      name: 'C',
      color: '#c0e3d0',
      attendance: ['09:30', '17:30'],
      breaks: [
        ['12:00', '13:00'],
        ['15:00', '15:30'],
      ],
    },
    {
      name: 'D',
      color: '#dee0c0',
      attendance: ['10:30', '18:30'],
      breaks: [
        ['12:00', '12:30'],
        ['15:00', '15:30'],
      ],
    },
  ]
}

const generateInterviewHistoryDummyData = () => {
  return [
    { id: 1, name: '美容皮膚科', date: '2023/07/07' },
    { id: 2, name: 'カウンセリング', date: '2023/07/06' },
    { id: 3, name: 'オンライン診療', date: '2023/07/04' },
    { id: 4, name: '美容外科', date: '2023/07/01' },
  ]
}

const generateInspectionHistoryDummyData = () => {
  return [
    {
      name: 'AST (GOT)',
      min: 10,
      max: 40,
      unit: 'U/L',
      days: [
        {
          day: '2020/01/06',
          value: 19,
        },
        {
          day: '2019/12/02',
          value: 23,
        },
        {
          day: '2019/11/02',
          value: 26,
        },
        {
          day: '2019/10/02',
          value: 25,
        },
        {
          day: '2019/09/02',
          value: 20,
        },
        {
          day: '2019/08/02',
          value: 17,
        },
      ],
    },
    {
      name: 'ALT (GPT)',
      min: 5,
      max: 45,
      unit: 'U/L',
      days: [
        {
          day: '2020/01/06',
          value: 18,
        },
        {
          day: '2019/12/02',
          value: 15,
        },
        {
          day: '2019/11/02',
          value: 17,
        },
        {
          day: '2019/10/02',
          value: 21,
        },
        {
          day: '2019/09/02',
          value: 27,
        },
        {
          day: '2019/08/02',
          value: 35,
        },
      ],
    },
    {
      name: 'ALP',
      min: 104,
      max: 338,
      unit: 'U/L',
      days: [
        {
          day: '2020/01/06',
          value: 308,
        },
        {
          day: '2019/12/02',
          value: 292,
        },
        {
          day: '2019/11/02',
          value: 281,
        },
        {
          day: '2019/10/02',
          value: 150,
        },
        {
          day: '2019/09/02',
          value: 200,
        },
        {
          day: '2019/08/02',
          value: 170,
        },
      ],
    },
    {
      name: 'y-GTy（yーGTP)',
      min: 5,
      max: 30,
      unit: 'U/L',
      days: [
        {
          day: '2020/01/06',
          value: 49,
        },
        {
          day: '2019/12/02',
          value: 60,
        },
        {
          day: '2019/11/02',
          value: 61,
        },
        {
          day: '2019/10/02',
          value: 21,
        },
        {
          day: '2019/09/02',
          value: 27,
        },
        {
          day: '2019/08/02',
          value: 50,
        },
      ],
    },
    {
      name: 'HDLコレステロール',
      min: 40,
      max: 90,
      unit: 'mg/dL',
      days: [
        {
          day: '2020/01/06',
          value: 70,
        },
        {
          day: '2019/12/02',
          value: 61,
        },
        {
          day: '2019/11/02',
          value: 58,
        },
        {
          day: '2019/10/02',
          value: 65,
        },
        {
          day: '2019/09/02',
          value: 80,
        },
        {
          day: '2019/08/02',
          value: 77,
        },
      ],
    },
    {
      name: '中性脂肪（TG)',
      min: 50,
      max: 149,
      unit: 'mg/dL',
      days: [
        {
          day: '2020/01/06',
          value: 88,
        },
        {
          day: '2019/12/02',
          value: 80,
        },
        {
          day: '2019/11/02',
          value: 74,
        },
        {
          day: '2019/10/02',
          value: 85,
        },
        {
          day: '2019/09/02',
          value: 60,
        },
        {
          day: '2019/08/02',
          value: 57,
        },
      ],
    },
    {
      name: 'ナトリウム',
      min: 135,
      max: 147,
      unit: 'mEq/L',
      days: [
        {
          day: '2020/01/06',
          value: 136,
        },
        {
          day: '2019/12/02',
          value: 121,
        },
        {
          day: '2019/11/02',
          value: 140,
        },
        {
          day: '2019/10/02',
          value: 152,
        },
        {
          day: '2019/09/02',
          value: 137,
        },
        {
          day: '2019/08/02',
          value: 160,
        },
      ],
    },
    {
      name: 'カリウム',
      min: 3.5,
      max: 5.0,
      unit: 'mEq/L',
      days: [
        {
          day: '2020/01/06',
          value: 3.7,
        },
        {
          day: '2019/12/02',
          value: 4.0,
        },
        {
          day: '2019/11/02',
          value: 2.9,
        },
        {
          day: '2019/10/02',
          value: 3.0,
        },
        {
          day: '2019/09/02',
          value: 4.2,
        },
        {
          day: '2019/08/02',
          value: 4.9,
        },
      ],
    },

    {
      name: '尿素窒素',
      min: 7.9,
      max: 21.7,
      unit: 'mg/dL',
      days: [
        {
          day: '2020/01/06',
          value: 8.7,
        },
        {
          day: '2019/12/02',
          value: 8.0,
        },
        {
          day: '2019/11/02',
          value: 8.9,
        },
        {
          day: '2019/10/02',
          value: 9.0,
        },
        {
          day: '2019/09/02',
          value: 10.2,
        },
        {
          day: '2019/08/02',
          value: 8.9,
        },
      ],
    },
    {
      name: 'クレアチニン',
      min: 0.47,
      max: 0.79,
      unit: 'mg/dL',
      days: [
        {
          day: '2020/01/06',
          value: 0.51,
        },
        {
          day: '2019/12/02',
          value: 0.39,
        },
        {
          day: '2019/11/02',
          value: 0.48,
        },
        {
          day: '2019/10/02',
          value: 0.62,
        },
        {
          day: '2019/09/02',
          value: 0.67,
        },
        {
          day: '2019/08/02',
          value: 0.75,
        },
      ],
    },
    {
      name: '血清鉄',
      min: 50,
      max: 140,
      unit: 'microg/dL',
      days: [
        {
          day: '2020/01/06',
          value: 123,
        },
        {
          day: '2019/12/02',
          value: 100,
        },
        {
          day: '2019/11/02',
          value: 99,
        },
        {
          day: '2019/10/02',
          value: 110,
        },
        {
          day: '2019/09/02',
          value: 83,
        },
        {
          day: '2019/08/02',
          value: 79,
        },
      ],
    },

    {
      name: '無機燐',
      min: 2.4,
      max: 4.4,
      unit: 'mg/dL',
      days: [
        {
          day: '2020/01/06',
          value: 3.2,
        },
        {
          day: '2019/12/02',
          value: 3.1,
        },
        {
          day: '2019/11/02',
          value: 2.7,
        },
        {
          day: '2019/10/02',
          value: 3.5,
        },
        {
          day: '2019/09/02',
          value: 4.8,
        },
        {
          day: '2019/08/02',
          value: 3.9,
        },
      ],
    },

    {
      name: 'クロール',
      min: 98,
      max: 108,
      unit: 'mEg/L',
      days: [
        {
          day: '2020/01/06',
          value: 110,
        },
        {
          day: '2019/12/02',
          value: 108,
        },
        {
          day: '2019/11/02',
          value: 102,
        },
        {
          day: '2019/10/02',
          value: 110,
        },
        {
          day: '2019/09/02',
          value: 104,
        },
        {
          day: '2019/08/02',
          value: 101,
        },
      ],
    },

    {
      name: 'LDLコレステロール',
      min: 70,
      max: 139,
      unit: 'mg/dL',
      days: [
        {
          day: '2020/01/06',
          value: 99,
        },
        {
          day: '2019/12/02',
          value: 119,
        },
        {
          day: '2019/11/02',
          value: 111,
        },
        {
          day: '2019/10/02',
          value: 124,
        },
        {
          day: '2019/09/02',
          value: 94,
        },
        {
          day: '2019/08/02',
          value: 133,
        },
      ],
    },

    {
      name: '血小板',
      min: 13.1,
      max: 36.5,
      unit: '10^4/microL',
      days: [
        {
          day: '2020/01/06',
          value: 26.4,
        },
        {
          day: '2019/12/02',
          value: 24.0,
        },
        {
          day: '2019/11/02',
          value: 22.9,
        },
        {
          day: '2019/10/02',
          value: 33.0,
        },
        {
          day: '2019/09/02',
          value: 24.2,
        },
        {
          day: '2019/08/02',
          value: 14.9,
        },
      ],
    },
    {
      name: '白血球数',
      min: 3.8,
      max: 9.6,
      unit: '10^3/microL',
      days: [
        {
          day: '2020/01/06',
          value: 7.2,
        },
        {
          day: '2019/12/02',
          value: 6.1,
        },
        {
          day: '2019/11/02',
          value: 5.9,
        },
        {
          day: '2019/10/02',
          value: 8.0,
        },
        {
          day: '2019/09/02',
          value: 8.2,
        },
        {
          day: '2019/08/02',
          value: 5.9,
        },
      ],
    },
  ]
}

const generateSymptomHistoryDummyData = () => {
  return [
    {
      id: 1,
      name: '美容皮膚科',
      date: '2023/07/01 ~ 2023/07/07',
      symptom: '-',
    },
    {
      id: 1,
      name: 'カウンセリング',
      date: '2023/09/01 ~ 2023/09/07',
      symptom: '-',
    },
    {
      id: 1,
      name: 'オンライン診療',
      date: '2023/10/01 ~ 2023/10/07',
      symptom: '-',
    },
  ]
}

const generateRegularDummyData = () => {
  return [
    { id: 1, name: '美容皮膚科', method: '-', status: '-' },
    { id: 1, name: 'test', method: '-', status: '-' },
  ]
}

const generateMedicineDummyData = () => {
  const data = [
    {
      id: 1,
      name: '美容皮膚科',
      administrationDate: '2023/07/07',
      contraindicationDate: '2023/06/07',
    },
    {
      id: 2,
      name: 'カウンセリング',
      administrationDate: '2023/08/01',
      contraindicationDate: '2023/07/23',
    },
    {
      id: 3,
      name: 'オンライン診療',
      administrationDate: '2024/02/01',
      contraindicationDate: '2024/01/01',
    },
  ]
  return data
}

const generateDocumentDummyData = () => {
  const data = []
  for (let i = 1; i < 3; i++) {
    data.push({
      name: faker.person.firstName(),
      user: faker.person.firstName(),
      type: 1,
      date: '2023/07/07',
    })
  }
  return data
}

const generateAllergyDummyData = () => {
  const data = []
  for (let i = 1; i < 3; i++) {
    data.push({
      id: i,
      name: faker.person.firstName(),
      date: '2020-03-01 ~ 2020-06-10',
      symptom: faker.person.firstName(),
    })
  }
  return data
}

const generateSymptomDummyData = () => {
  const data = []
  for (let i = 1; i < 3; i++) {
    data.push({
      id: i,
      name: faker.person.firstName(),
      date: '2020-03-01',
      insurance: 0,
    })
  }
  return data
}

const generateMedicialHistoryDummyData = () => {
  const data = []
  for (let i = 1; i < 3; i++) {
    data.push({
      id: i,
      name: faker.person.firstName(),
      date: '2020-03-01 ~ 2024-06-01',
      surgery: 'あり',
      status: 0,
    })
  }
  return data
}

const generateTreatmentDummyData = () => {
  const data = []
  for (let i = 1; i < 5; i++) {
    data.push({
      id: i,
      treatment: {
        id: i,
        clinic_id: i,
        name: faker.person.firstName(),
      },
      clinic_id: i,
      start_date: '2024-03-01',
      post_date: '2024-03-01',
      insurance_id: i,
      memo: '',
    })
  }
  return data
}

const patientDumy = () => {
  const randVal = Math.random()
  return {
    id: Math.floor(randVal * 10000),
    gender: randVal < 0.5 ? 1 : 2,
    birth_year: '2000-01-01',
    clinical_number: '1234',
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    first_name_furigana: faker.person.firstName(),
    last_name_furigana: faker.person.lastName(),
    last_arrived_time: '2024-01-01',
    clinic_name: 'examination',
    doctor: 'name',
  }
}
const generatePaymentDummyData = () => {
  const data = []
  for (let i = 1; i < 20; i++) {
    const randVal = Math.random()
    data.push({
      id: i,
      type: 1,
      payment_time: '2024-01-01',
      total: i * 1000,
      unit: 'jpy',
      status: 2,
      patient: {
        id: i,
        gender: randVal < 0.5 ? 1 : 2,
        birth_year: '2000-01-01',
        clinical_number: '1234',
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        first_name_furigana: faker.person.firstName(),
        last_name_furigana: faker.person.lastName(),
        last_arrived_time: '2024-01-01',
        clinic_name: 'examination',
        doctor: 'name',
      },
    })
  }
  return data
}
const generatePatienteDummyData = () => {
  const patients = []
  for (let i = 1; i < 20; i++) {
    const randVal = Math.random()
    patients.push({
      id: i,
      gender: randVal < 0.5 ? 1 : 2,
      birth_year: '2000-01-01',
      clinical_number: '1234',
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      first_name_furigana: faker.person.firstName(),
      last_name_furigana: faker.person.lastName(),
      last_arrived_time: '2024-01-01',
      clinic_name: 'examination',
      doctor: 'name',
    })
  }
  return patients
}
const generateScheduleDummyData = (startDate: Date, endDate: Date) => {
  const dateArray: {
    start_time: string
    data: {
      date: string
      is_holiday: boolean
      warning: string
      schedules: { title: string; id: number }[]
    }[]
  }[] = []

  const endDateTime = new Date(endDate)
  const timeRange = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
  ]

  timeRange.forEach((time_value: string) => {
    const daySchedules = []
    let currentDate = new Date(startDate)
    let counter = 0
    while (currentDate < endDateTime) {
      counter += 1
      const randVal = Math.random()
      daySchedules.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        is_holiday: randVal >= 0.5,
        warning: randVal >= 0.5 ? '' : '予約が埋まる',
        schedules: [
          {
            id: counter,
            title:
              randVal < 0.25
                ? 'MrA'
                : randVal < 0.5
                  ? 'Mrs B'
                  : randVal < 0.75
                    ? 'Mr C'
                    : 'MrD',
          },
        ],
      })
      currentDate = addDays(currentDate, 1)
    }
    dateArray.push({
      start_time: time_value,
      data: daySchedules,
    })
  })

  return dateArray
}

const generateReceptionDummyData = () => {
  const receptions = []
  for (let i = 1; i < 15; i++) {
    const randVal = Math.random()
    receptions.push({
      id: i,
      appointmentTime:
        randVal < 0.1
          ? '10:00~10:30'
          : randVal < 0.2
            ? '10:30~11:00'
            : randVal < 0.3
              ? '11:00~11:30'
              : randVal < 0.4
                ? '11:30~12:00'
                : randVal < 0.5
                  ? '12:00~12:30'
                  : randVal < 0.6
                    ? '12:30~13:00'
                    : randVal < 0.7
                      ? '13:00~13:30'
                      : randVal < 0.8
                        ? '13:30~14:00'
                        : randVal < 0.9
                          ? '14:00~14:30'
                          : '16:00~16:30',
      receptionTime: '13:00',
      status: Math.floor((0.2 + randVal) * 5),
      patient: {
        id: i,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        firstNameFurigana: 'タロ',
        lastNameFurigana: 'タロ',
        gender: randVal < 0.5 ? 1 : 2,
        birth_year: '1950',
        clinical_number: '121212',
      },
      examination: {
        id: 1,
        name: faker.person.fullName(),
      },
      doctor: {
        id: 1,
        name: faker.person.fullName(),
      },
      memo: [
        {
          id: 1,
          content: faker.person.fullName(),
        },
      ],
      labels: [
        {
          id: 1,
          name: faker.person.fullName(),
        },
        {
          id: 2,
          name: faker.person.fullName(),
        },
      ],
    })
  }

  return receptions
}

const scheduleDummyDetail = {
  id: 1,
  appointmentTime: '10:30',
  receptionTime: '13:00',
  status: 1,
  type: '再診',
  patient: {
    id: 1,
    firstName: 'Taro A',
    lastName: 'Taro',
    firstNameFurigana: 'タロ',
    lastNameFurigana: 'タロ',
    gender: 1,
    birth_year: '1950',
    clinical_number: '121212',
  },
  examination: {
    id: 1,
    name: 'test',
  },
  doctor: {
    id: 1,
    name: 'Doctor A',
  },
  memo: {
    id: 1,
    content: 'test memo',
  },
  labels: [
    {
      id: 1,
      name: 'xxxx',
    },
    {
      id: 2,
      name: 'yyyy',
    },
  ],
}

const checkListDummyData: Questionaire = Questionaire.fromJson({
  content: [
    {
      type: 'お悩みの内容',
      question:
        'お肌のお悩みや心配事がある場合には、 チェックを入れてください。',
      answer_type: 2, //multi
      answers: [],
      options: [
        '肌あれ',
        '乾燥',
        '毛穴の開き',
        'シミ',
        'そばかす',
        '肝斑',
        'ホクロ',
        'シワ',
        'たるみ',
        'ニキビ',
        'ニキビ跡',
        '赤み',
        '日焼け',
        'その他',
      ],
    },
    {
      type: '現病歴',
      question: '現在治療中のご持病はありますか。',
      answer_type: 1, //text
      answers: [],
    },
    {
      type: '内服薬',
      question: '現在服用中の薬はありますか。ある場合は入力してください。',
      answer_type: 1, //text
      answers: [],
    },
    {
      type: 'アレルギー',
      question:
        'これまでに、肌がかぶれたり蕁麻疹や痒みなどのアレルギー反応が出たことはありますか。ある場合は、該当する食べ物や物を入力してください。',
      answer_type: 1, //text
      answers: [],
    },
    {
      type: '化粧品',
      question:
        '現在使用している化粧品はありますか。ある場合は入力してください。',
      answer_type: 1, //text
      answers: [],
    },
    {
      type: '美容施術',
      question:
        '過去半年間に美容整形手術やレーザー治療を受けましたか。受けたことがある場合はその施術名を入力してください。',
      answer_type: 1, //text
      answers: [],
    },
  ],
})

// Q1. 院内環境の満足度はいかがでしたか？
// Q2. 受付・カウンセラーの接客はいかがでしたか？
// Q3. 施術者（看護師）の接客はいかがでしたか？
// Q4. 施術・治療の満足度はいかがでしたか？
// Q5. 当院をご家族やご友人におすすめしたいと思いますか？
// Q6.心に残るおもてなしをさせていただいたスタッフがおりましたら詳細をお聞かせください。 みなさまのお言葉を今後の励みに致します。
// Q7.当院の改善点を1つお聞かせください。

const surveyDummyData: Questionaire = Questionaire.fromJson({
  content: [
    {
      type: 'survey',
      question: '院内環境の満足度はいかがでしたか？',
      answer_type: 3, //text
      answers: [],
      options: Array.from({ length: 10 }, (_, i) => String(i + 1)),
    },
    {
      type: 'survey',
      question: '受付・カウンセラーの接客はいかがでしたか？',
      answer_type: 3, //text
      answers: [],
      options: Array.from({ length: 10 }, (_, i) => String(i + 1)),
    },
    {
      type: 'survey',
      question: '施術者（看護師）の接客はいかがでしたか？',
      answer_type: 3, //text
      answers: [],
      options: Array.from({ length: 10 }, (_, i) => String(i + 1)),
    },
    {
      type: 'survey',
      question: '施術・治療の満足度はいかがでしたか？',
      answer_type: 3, //text
      answers: [],
      options: Array.from({ length: 10 }, (_, i) => String(i + 1)),
    },
    {
      type: 'survey',
      question: '当院をご家族やご友人におすすめしたいと思いますか？',
      answer_type: 3, //text
      answers: [],
      options: Array.from({ length: 10 }, (_, i) => String(i + 1)),
    },
    {
      type: 'survey',
      question:
        '心に残るおもてなしをさせていただいたスタッフがおりましたら詳細をお聞かせください。 みなさまのお言葉を今後の励みに致します。',
      answer_type: 1, //text
      answers: [],
    },
    {
      type: 'survey',
      question: '当院の改善点を1つお聞かせください。',
      answer_type: 1, //text
      answers: [],
    },
  ],
})

const messageDummyData = [
  {
    id: 1,
    from: 'admin', //admin vs client
    text: 'こんにちは',
    sent_at: '15:04',
  },
  {
    id: 1,
    from: 'client', //admin vs client
    text: 'こんにちは',
    sent_at: '15:05',
  },
]

export {
  checkListDummyData,
  generateAllergyDummyData,
  generateDocumentDummyData,
  generateInspectionHistoryDummyData,
  generateInterviewHistoryDummyData,
  generateMedicialHistoryDummyData,
  generateMedicineDummyData,
  generateMenuDummyData,
  generatePatienteDummyData,
  generatePaymentDummyData,
  generateReceptionDummyData,
  generateRegularDummyData,
  generateScheduleDummyData,
  generateShiftDetailDummyData,
  generateShiftMasterDummyData,
  generateSymptomDummyData,
  generateSymptomHistoryDummyData,
  generateTreatmentDummyData,
  messageDummyData,
  patientDumy,
  scheduleDummyDetail,
  surveyDummyData,
}
