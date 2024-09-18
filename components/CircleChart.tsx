// components/CircleChart.tsx
import type { ChartOptions } from 'chart.js'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface CircleChartProps {
  data: number[]
  labels: string[]
  title: string
  defaultColor?: string[]
}

const generateRandomColor = (): string => {
  const random255 = () => Math.floor(Math.random() * 256)
  return `rgb(${random255()}, ${random255()}, ${random255()})`
}

const CircleChart: React.FC<CircleChartProps> = ({
  data,
  labels,
  title,
  defaultColor,
}) => {
  const colors = defaultColor
    ? defaultColor
    : data.map(() => generateRandomColor())
  // Data for the chart
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    plugins: {
      tooltip: {
        callbacks: {
          label(context) {
            const label = context.label || ''
            const value = context.raw as number
            const total = context.dataset.data.reduce(
              (acc: number, curr: number) => acc + curr,
              0,
            )
            const percentage = ((value / total) * 100).toFixed(2) + '%'
            return `${label}: ${percentage}`
          },
        },
      },
    },
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="text-center text-xl font-semibold text-gray-800">
        {title}
      </h2>
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

export default CircleChart
