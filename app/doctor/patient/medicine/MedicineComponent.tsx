'use client'

const PatientMedicineComponent: React.FC = () => {
  const data = [
    { name: 'シナール', unit: '錠', quantiy: '3/日' },
    { name: 'ユベラ', unit: '錠', quantiy: '3/日' },
    { name: 'トラサミン', unit: '錠', quantiy: '3/日' },
  ]

  return (
    <div className="justify-center text-black">
      <select className="my-2 w-32 rounded border p-2">
        <option>過去1年間</option>
        <option>--</option>
      </select>
      <div className="">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border">医薬品名</th>
              <th className="border">単位</th>
              <th className="border">診断日</th>
              <th className="border" colSpan={4}>
                飲み方
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`border ${index % 2 !== 0 ? 'bg-gray-100' : 'bg-white'}`}
              >
                <td className="border text-center">{item.name}</td>
                <td className="border text-center">
                  <select
                    value={item.unit}
                    className="mx-auto bg-transparent text-center"
                  >
                    <option value="-">-</option>
                    <option value="錠">錠</option>
                    <option value="包">包</option>
                    <option value="カプセル">カプセル</option>
                    <option value="本">本</option>
                    <option value="シート">シート</option>
                    <option value="瓶">瓶</option>
                  </select>
                </td>
                <td className="border text-center">
                  <input type="date" className="bg-transparent"></input>
                </td>

                <th className="border px-2">1回</th>
                <th className="border px-2">
                  <select className="bg-transparent">
                    <option value="-">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </th>
                <th className="border px-2">1日</th>
                <th className="flex border px-2">
                  <select className="bg-transparent">
                    <option value="-">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <p className="mx-2">回</p>
                  <input
                    type="text"
                    className="w-full bg-transparent"
                    placeholder="朝、昼、夕の食後"
                  />
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PatientMedicineComponent
