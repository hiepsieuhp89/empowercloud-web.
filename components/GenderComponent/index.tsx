import React from 'react'

interface GenderComponentParams {
  sex: number
}
const GenderComponent: React.FC<GenderComponentParams> = ({ sex }) => {
  return (
    <div className="w-full text-center">
      {sex == 2 ? '女性' : sex == 1 ? '男性' : 'その他'}
    </div>
  )
}

export default GenderComponent
