'use client'
import BarChart from '@/components/BarChart'
import CircleChart from '@/components/CircleChart'
import CombinedChart from '@/components/CombinedChart'
import StackedBarChart from '@/components/StackedBarChart'
import React, { useCallback, useEffect, useState } from 'react'

const ChartList: React.FC = () => {
  const [summaryType, setSummaryType] = useState('month')

  const [xData, setXdata] = useState<number[]>([])

  const [yData, setYdata] = useState<string[]>([])

  const changeMemoTypeMonth = useCallback(() => {
    setSummaryType('month')
  }, [setSummaryType])

  const changeMemoTypeYear = useCallback(() => {
    setSummaryType('year')
  }, [setSummaryType])

  // const changeMemoTypeSales = useCallback(() => {
  //   setSummaryType('sales')
  // }, [setSummaryType])

  useEffect(() => {
    const tmpXdata = []
    const tmpYdata = []
    if (summaryType == 'month') {
      for (let i = 1; i < 32; i++) {
        tmpXdata.push(1000 * Math.round(100 * i + 400 + 100 * Math.random()))
        tmpYdata.push(`2024-01-${i}`)
      }
    } else {
      for (let i = 1; i < 13; i++) {
        tmpXdata.push(1000000 * Math.round(100 * i + 400 + 100 * Math.random()))
        tmpYdata.push(`2023-${i}`)
      }
    }
    setXdata(tmpXdata)
    setYdata(tmpYdata)
  }, [summaryType])

  return (
    <div className="h-screen">
      <div className="flex border-b-2 border-gray-100 lg:px-16">
        <button
          className={`px-4 py-2 font-bold text-black ${summaryType === 'month' ? 'border-b-4 border-main-500' : ''}`}
          onClick={changeMemoTypeMonth}
        >
          月次分析
        </button>
        <button
          className={`px-4 py-2 font-bold text-black ${summaryType === 'year' ? 'border-b-4 border-main-500' : ''}`}
          onClick={changeMemoTypeYear}
        >
          年次分析
        </button>
        {/* <button
          className={`px-4 py-2 font-bold text-black ${summaryType === 'sales' ? 'border-b-4 border-main-500' : ''}`}
          onClick={changeMemoTypeSales}
        >
          売上一覧
        </button> */}
      </div>
      <div className="flex px-8 py-0 text-black">
        <div className="flex w-1/2 border-b-4 border-r-2 py-2">
          <div className="w-1/2 border-r">
            <div className="flex w-full">
              <div className="rounded-3xl border bg-main-200 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
                  />
                </svg>
              </div>
              <p className="mx-2">売上</p>
            </div>
            <div className="w-1/2">
              <div className="flex w-full items-end font-bold">
                <p className="text-2xl">990,280</p>
                <p className="text-md mx-2">円</p>
              </div>
            </div>
          </div>

          <div className="mx-4 w-1/2">
            <div className="flex w-full">
              <div className="rounded-3xl border bg-pink-100 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="mx-2">診察数</p>
            </div>
            <div className="w-1/2">
              <div className="flex w-full items-end font-bold">
                <p className="text-2xl">270</p>
                <p className="text-md mx-2">件</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-1/2 border-b-4 border-l-2 p-2">
          <div className="w-1/3">
            <div className="flex w-full">
              <div className="rounded-3xl border bg-main-100 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="mx-2">予約数</p>
            </div>
            <div className="flex w-full items-end font-bold">
              <p className="text-2xl">509</p>
              <p className="text-md mx-2">件</p>
            </div>
          </div>

          <div className="w-1/2">
            <div className="flex w-full">
              <div className="rounded-3xl border bg-main-50 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4 text-pink-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="mx-2">キャンセル数</p>
            </div>
            <div className="flex w-full items-end font-bold">
              <p className="text-2xl">30</p>
              <p className="text-md mx-2">件</p>
            </div>
          </div>

          <div className="w-1/2">
            <div className="flex w-full">
              <div className="rounded-2xl border bg-blue-300 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
              <p className="mx-2">キャンセル率</p>
            </div>
            <div className="w-1/2">
              <div className="flex w-full items-end font-bold">
                <p className="text-2xl">5.8</p>
                <p className="text-md mx-2">%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-1/3 w-full">
        <div className="flex w-1/2">
          <BarChart
            data={xData}
            labels={yData}
            title="日別売上"
            unit={['', '売上(円)']}
          />
        </div>
        <div className="flex w-1/2">
          <div className="mx-4 w-2/3">
            <h1 className="font-bold text-black">施術別件数と売上</h1>
            <CombinedChart
              xLabels={[
                'AGA',
                'アートマイク',
                'ダームペン',
                'ハイフ',
                'ボトックス',
                '二重',
                '説毛',
                'その他',
              ]}
              yLabels={['件数', '売上']}
            />
          </div>
          <div className="w-1/3 px-2  text-black">
            <h1 className="py-2 font-bold">施術別件数と売上</h1>
            <table className="border text-center text-xs">
              <thead>
                <tr>
                  <th className="border">施術</th>
                  <th className="border">件数</th>
                  <th className="border">売上</th>
                </tr>
              </thead>
              <tbody>
                {[
                  'AGA',
                  'アートマイク',
                  'ダームペン',
                  'ハイフ',
                  'ボトックス',
                  '二重',
                  '説毛',
                  'その他',
                ].map((i, _id) => (
                  <tr key={_id}>
                    <td className="border">{i}</td>
                    <td className="border">{Math.round(30 * Math.random())}</td>
                    <td className="border">
                      {300 * Math.round(30 + 30 * Math.random())}円
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border">合計</td>
                  <td className="border">100</td>
                  <td className="border">1,627,087円</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex w-full">
        <div className="flex w-full py-2">
          <div className="w-1/3 border">
            <CircleChart
              data={[45, 55]}
              labels={['初診', '再診']}
              defaultColor={['#1b9899', '#f285ce']}
              title="再診割合"
            />
          </div>

          <div className="w-1/3 border">
            <CircleChart
              data={[20, 80]}
              labels={['初診', '再診']}
              defaultColor={['#1b9899', '#f285ce']}
              title="再診割合（男性）"
            />
          </div>

          <div className="w-1/3 border">
            <CircleChart
              data={[35, 65]}
              labels={['初診', '再診']}
              defaultColor={['#1b9899', '#f285ce']}
              title="再診割合（女性）"
            />
          </div>
        </div>
      </div>
      <div className="my-2 flex w-full">
        <div className="w-1/3 border">
          <CircleChart
            data={[35, 45, 20]}
            labels={['女性', '男性', '未設定']}
            defaultColor={['#1b9899', '#f285ce', 'blue']}
            title="男女比"
          />
        </div>

        <div className="w-1/3 border">
          <CircleChart
            data={[15, 5, 5, 5, 5, 15, 5, 5, 15, 5, 5, 15]}
            labels={[
              '10代',
              '20-24歳',
              '25-29歳',
              '30-34歳',
              '35-39歳',
              '40-44歳',
              '45-49歳',
              '50-54歳',
              '55-59歳',
              '60-64歳',
              '65歳以上',
              '誕生日入力なし',
            ]}
            // defaultColor={['#1b9899','#f285ce','blue']}
            title="年代別売上割合(女性)"
          />
        </div>

        <div className="w-1/3 border">
          <CircleChart
            data={[15, 5, 5, 5, 5, 15, 5, 5, 15, 5, 5, 15]}
            labels={[
              '10代',
              '20-24歳',
              '25-29歳',
              '30-34歳',
              '35-39歳',
              '40-44歳',
              '45-49歳',
              '50-54歳',
              '55-59歳',
              '60-64歳',
              '65歳以上',
              '誕生日入力なし',
            ]}
            // defaultColor={['#1b9899','#f285ce','blue']}
            title="年代別売上割合(男性)"
          />
        </div>
      </div>

      {/* <div className="flex w-full">
        <div className="w-1/3 border">
          <CircleChart
            data={[20, 25, 22, 15, 10, 8]}
            labels={['２０代', '３０代', '40代', '５０代', '６０代', '７０代']}
            title="年代別売上割合"
          />
        </div>
        <div className="w-1/3 border">
          <CircleChart
            data={[15, 15, 15, 15, 15, 15, 5, 5]}
            labels={[
              'AGA',
              'アートマイク',
              'ダームペン',
              'ハイフ',
              'ボトックス',
              '二重',
              '説毛',
              'その他',
            ]}
            title="年代別施術売上割合（女性30~34代）"
          />
        </div>
        <div className="w-1/3 border">
          <CircleChart
            data={[15, 15, 15, 15, 15, 15, 5, 5]}
            labels={[
              'AGA',
              'アートマイク',
              'ダームペン',
              'ハイフ',
              'ボトックス',
              '二重',
              '説毛',
              'その他',
            ]}
            title="年代別施術売上割合（女性35~39代）"
          />
        </div>
      </div> */}

      <div className="my-2 flex w-full">
        <div className="w-1/3 border">
          <CircleChart
            data={[15, 15, 15, 15, 15, 15, 5, 5]}
            labels={[
              'AGA',
              'アートマイク',
              'ダームペン',
              'ハイフ',
              'ボトックス',
              '二重',
              '説毛',
              'その他',
            ]}
            title="年代別施術売上割合（女性10代）"
          />
        </div>

        <div className="w-1/3 border">
          <CircleChart
            data={[15, 15, 15, 15, 15, 15, 5, 5]}
            labels={[
              'AGA',
              'アートマイク',
              'ダームペン',
              'ハイフ',
              'ボトックス',
              '二重',
              '説毛',
              'その他',
            ]}
            // defaultColor={['#1b9899','#f285ce','blue']}
            title="年代別施術売上割合（女性20~24歳）"
          />
        </div>

        <div className="w-1/3 border">
          <CircleChart
            data={[15, 15, 15, 15, 15, 15, 5, 5]}
            labels={[
              'AGA',
              'アートマイク',
              'ダームペン',
              'ハイフ',
              'ボトックス',
              '二重',
              '説毛',
              'その他',
            ]}
            // defaultColor={['#1b9899','#f285ce','blue']}
            title="年代別施術売上割合（女性25~29歳）"
          />
        </div>
      </div>

      <div className="flex w-full">
        <div className="w-1/3">
          <StackedBarChart
            title="年代別施術件数"
            labels={[
              '10代',
              '20-24歳',
              '25-29歳',
              '30-34歳',
              '35-39歳',
              '40-44歳',
              '45-49歳',
              '50-54歳',
              '55-59歳',
              '60-64歳',
              '65歳以上',
              '誕生日入力なし',
            ]}
            subLabels={[
              'AGA',
              'アートマイク',
              'ダームペン',
              'ハイフ',
              'ボトックス',
              '二重',
              '説毛',
              'その他',
            ]}
          />
        </div>

        <div className="w-1/3">
          <StackedBarChart
            title="年代別施術件数（女性）"
            labels={[
              '10代',
              '20-24歳',
              '25-29歳',
              '30-34歳',
              '35-39歳',
              '40-44歳',
              '45-49歳',
              '50-54歳',
              '55-59歳',
              '60-64歳',
              '65歳以上',
              '誕生日入力なし',
            ]}
            subLabels={[
              'AGA',
              'アートマイク',
              'ダームペン',
              'ハイフ',
              'ボトックス',
              '二重',
              '説毛',
              'その他',
            ]}
          />
        </div>

        <div className="w-1/3">
          <StackedBarChart
            title="年代別施術件数（男性）"
            labels={[
              '10代',
              '20-24歳',
              '25-29歳',
              '30-34歳',
              '35-39歳',
              '40-44歳',
              '45-49歳',
              '50-54歳',
              '55-59歳',
              '60-64歳',
              '65歳以上',
              '誕生日入力なし',
            ]}
            subLabels={[
              'AGA',
              'アートマイク',
              'ダームペン',
              'ハイフ',
              'ボトックス',
              '二重',
              '説毛',
              'その他',
            ]}
          />
        </div>
      </div>

      <div className="flex w-full">
        <div className="flex w-1/2">
          <CircleChart
            data={[8, 8, 12, 8, 8, 8, 12, 8, 8, 8, 12]}
            labels={[
              'A*',
              'Facebook',
              'Instagram',
              '○○先生のご友人',
              '○○様のご紹介',
              'クマポン',
              'インスタ',
              'リスティング',
              'ツイッター',
              'キレイバス',
              '広告',
              'その他',
            ]}
            title="登録線路別売上割合"
          />
        </div>
        <div className="flex w-1/2">
          <CircleChart
            data={[20, 80]}
            labels={['新規', 'リピータ']}
            title="新規・リピーター売上割合"
          />
        </div>
      </div>

      <div className="flex w-full">
        <div className="block w-1/3">
          <h1 className="w-full font-bold text-black">登録線路別件数</h1>
          <div className="w-full">
            <BarChart
              data={[8, 8, 12, 8, 8, 8, 12, 8, 8, 8, 4, 8]}
              labels={[
                'A*',
                'Facebook',
                'Instagram',
                '○○先生のご友人',
                '○○様のご紹介',
                'クマポン',
                'インスタ',
                'リスティング',
                'ツイッター',
                'キレイバス',
                '広告',
                'その他',
              ]}
              title=""
              revertAxis={true}
            />
          </div>
        </div>
        <div className="mx-4 w-1/3">
          <h1 className="font-bold text-black">登録線路別キャンセル率・件数</h1>
          <CombinedChart
            twoAxis={true}
            xLabels={[
              'A*',
              'Facebook',
              'Instagram',
              '○○先生のご友人',
              '○○様のご紹介',
              'クマポン',
              'インスタ',
              'リスティング',
              'ツイッター',
              'キレイバス',
              '広告',
              'その他',
            ]}
            yLabels={['率', '件数']}
          />
          <h1 className="text-center font-bold text-black">登録線路</h1>
        </div>

        <div className="mx-4 w-1/3">
          <h1 className="font-bold text-black">登録線路別キャンセル率・件数</h1>
          <CombinedChart
            twoAxis={true}
            xLabels={[
              'AGA',
              'アートマイク',
              'ダームペン',
              'ハイフ',
              'ボトックス',
              '二重',
              '説毛',
              'その他',
            ]}
            yLabels={['率', '件数']}
          />
          <h1 className="text-center font-bold text-black">施術</h1>
        </div>
      </div>

      <div className="flex w-full">
        <div className="flex w-full">
          <div className="w-2/3">
            <StackedBarChart
              title="年代別施術トレンド分析"
              labels={[
                '2023年01月',
                '2023年02月',
                '2023年03月',
                '2023年04月',
                '2023年05月',
                '2023年06月',
                '2023年07月',
                '2023年08月',
                '2023年09月',
                '2023年10月',
                '2023年11月',
                '2023年12月',
              ]}
              axisLabel={['件数', '施術']}
              subLabels={[
                'AGA',
                'アートマイク',
                'ダームペン',
                'ハイフ',
                'ボトックス',
                '二重',
                '説毛',
                'その他',
              ]}
            />
          </div>
          <div className="w-1/3 px-2  text-black">
            <h1 className="py-2 font-bold">年代別施術トレンド分析</h1>
            <table className="border text-center text-xs">
              <thead>
                <tr>
                  <th className="border"></th>
                  <th className="border">AGA</th>
                  <th className="border">アートマイク</th>
                  <th className="border">ダームペン</th>
                  <th className="border">ハイフ</th>
                  <th className="border">ボトックス</th>
                  <th className="border">二重</th>
                  <th className="border">説毛</th>
                  <th className="border">その他</th>
                </tr>
              </thead>
              <tbody>
                {[
                  '2023年01月',
                  '2023年02月',
                  '2023年03月',
                  '2023年04月',
                  '2023年05月',
                  '2023年06月',
                  '2023年07月',
                  '2023年08月',
                  '2023年09月',
                  '2023年10月',
                  '2023年11月',
                  '2023年12月',
                ].map((i, _id) => (
                  <tr key={_id}>
                    <td className="border">{i}</td>
                    {[
                      'AGA',
                      'アートマイク',
                      'ダームペン',
                      'ハイフ',
                      'ボトックス',
                      '二重',
                      '説毛',
                      'その他',
                    ].map((j, _jid) => (
                      <td key={_jid} className="border">
                        {Math.round(30 * Math.random())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartList
