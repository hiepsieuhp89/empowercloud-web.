// components/BarChart.tsx
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import React from 'react'
import { Bar } from 'react-chartjs-2'

// Register necessary chart elements
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

// Define props for the component
interface BarChartProps {
  data: number[]
  labels: string[]
  title: string
  revertAxis?: boolean
  unit?: string[]
}

const generateRandomColor = (): string => {
  const random255 = () => Math.floor(Math.random() * 256)
  return `rgb(${random255()}, ${random255()}, ${random255()})`
}

// BarChart component
const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  title,
  revertAxis = false,
  unit = [],
}) => {
  // Configuration for the bar chart
  const colors = data.map(() => generateRandomColor())
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors[0], // Customize color
        borderColor: colors[0],
        borderWidth: 1,
      },
    ],
  }

  const options: {
    responsive: boolean
    indexAxis: 'x' | 'y' | undefined
    scales: {
      x: {
        beginAtZero: boolean
        title: {
          display: boolean
          text: string
        }
      }
      y: {
        beginAtZero: boolean
        title: {
          display: boolean
          text: string
        }
      }
    }
    plugins: {
      legend: {
        display: boolean
      }
    }
  } = {
    responsive: true,
    indexAxis: revertAxis ? 'y' : 'x',
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: unit.length > 0 ? true : false,
          text: unit[0],
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: unit.length > 0 ? true : false,
          text: unit[1], //'売上(円)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="flex size-full h-full justify-center">
      <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
        {title}
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default BarChart
