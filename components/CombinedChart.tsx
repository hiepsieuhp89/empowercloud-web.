// components/CombinedChart.tsx

import { faker } from '@faker-js/faker'
import type { ChartOptions } from 'chart.js'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import React from 'react'
import { Chart } from 'react-chartjs-2'

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
)

interface CombinedChartProps {
  data?: number[]
  labels?: string[]
  title?: string
  xLabels?: string[]
  yLabels?: string[]
  twoAxis?: boolean
}

const CombinedChart: React.FC<CombinedChartProps> = ({
  xLabels = [],
  yLabels = [],
  twoAxis = false,
}) => {
  const data = {
    labels: xLabels,
    datasets: [
      {
        type: 'line' as const,
        label: yLabels[0],
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        fill: false,
        data: xLabels.map(() =>
          faker.datatype.number({ min: 0, max: twoAxis ? 10 : 800000 }),
        ),
        yAxisID: 'y-axis-1',
      },
      {
        type: 'bar' as const,
        label: yLabels[1],
        backgroundColor: 'rgb(53, 162, 235)',
        data: xLabels.map(() => faker.datatype.number({ min: 0, max: 800000 })),
        yAxisID: twoAxis ? 'y-axis-2' : 'y-axis-1',
      },
    ],
  }

  const options: ChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      'y-axis-1': {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: false,
        },
      },
      'y-axis-2': {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false, // only draw grid lines for this axis
        },
        title: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  return <Chart type="bar" data={data} options={twoAxis ? options : {}} />
}

export default CombinedChart
