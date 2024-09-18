// components/StackedBarChart.tsx

import type { ChartData, ChartOptions } from 'chart.js'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import React from 'react'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface StackedBarChartProps {
  labels?: string[]
  subLabels?: string[]
  title: string
  axisLabel?: string[]
}

const generateRandomColor = (): string => {
  const random255 = () => Math.floor(Math.random() * 256)
  return `rgb(${random255()}, ${random255()}, ${random255()})`
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  labels = ['January', 'February', 'March', 'April', 'May', 'June'],
  subLabels = ['Product A', 'Product B', 'Product C'],
  title,
  axisLabel = [],
}) => {
  const data: ChartData<'bar'> = {
    labels,
    datasets: subLabels.map((i) => ({
      label: i,
      data: Array.from({ length: labels.length }, () =>
        Math.floor(Math.random() * 200),
      ),
      backgroundColor: generateRandomColor(),
    })),
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: axisLabel.length > 0 ? true : false,
          text: axisLabel[0],
        },
      },
      y: {
        stacked: true,
        title: {
          display: axisLabel.length > 0 ? true : false,
          text: axisLabel[1],
        },
      },
    },
  }

  return (
    <div className="w-full">
      <div className="w-full font-bold text-black">
        <h1>{title}</h1>
      </div>
      <div className="w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default StackedBarChart
