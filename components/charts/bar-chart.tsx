"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface BarChartProps {
  data: Array<{
    month: string
    ideas: number
    implemented: number
  }>
}

export function BarChart({ data }: BarChartProps) {
  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: "Ideas",
        data: data.map(d => d.ideas),
        backgroundColor: "rgba(53, 162, 235, 0.5)"
      },
      {
        label: "Implemented",
        data: data.map(d => d.implemented),
        backgroundColor: "rgba(75, 192, 192, 0.5)"
      }
    ]
  }

  return <Bar data={chartData} />
}