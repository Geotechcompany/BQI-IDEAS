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
import { Skeleton } from "../../../components/ui/skeleton"
import { Users, TrendingUp, CheckCircle, BarChart2 } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const { data, isLoading } = useAnalytics(timeRange)

  const stats = [
    {
      title: "Total Users",
      value: "2,345",
      icon: Users,
      change: "+12%",
      trend: "up"
    },
    {
      title: "Active Ideas",
      value: "1,234",
      icon: TrendingUp,
      change: "+8%",
      trend: "up"
    },
    {
      title: "Implementation Rate",
      value: "67%",
      icon: CheckCircle,
      change: "-5%",
      trend: "down"
    },
    {
      title: "Engagement Score",
      value: "89",
      icon: BarChart2,
      change: "+15%",
      trend: "up"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-4 md:p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px] sm:w-[180px]">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`flex items-center mt-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      stat.trend === 'down' && 'rotate-180'
                    }`} />
                    {stat.change} from last period
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] sm:h-[400px]">
                <BarChart data={data?.monthlyIdeas || []} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] sm:h-[400px]">
                <DoughnutChart data={data?.departmentStats || []} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Engagement', 'Performance', 'Growth'].map((metric) => (
          <Card key={metric} className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-lg">{metric} Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[100px] w-full" />
              ) : (
                <div className="h-[100px]">
                  <LineChart data={[]} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  )
} 