"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { BarChart, LineChart, DoughnutChart } from "@/components/charts"
import { useAnalytics } from "../../../hooks/use-analytics"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { useState } from "react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const { data, isLoading } = useAnalytics(timeRange)

  const sampleData = {
    monthlyIdeas: [
      { month: "Jan", ideas: 10, implemented: 5 },
      { month: "Feb", ideas: 15, implemented: 8 },
      { month: "Mar", ideas: 20, implemented: 12 },
    ],
    departmentStats: [
      { id: "engineering", value: 30, label: "Engineering" },
      { id: "operations", value: 20, label: "Operations" },
      { id: "services", value: 15, label: "Services" },
    ],
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">123</div>
          </CardContent>
        </Card>
        {/* Add more summary cards */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={sampleData.monthlyIdeas} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DoughnutChart data={sampleData.departmentStats} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
} 