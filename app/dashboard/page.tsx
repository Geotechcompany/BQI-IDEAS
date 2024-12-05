"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { IdeasGrid } from "../components/ideas-grid"
import { AddIdeaDialog } from "../components/add-idea-dialog"
import { useIdeas } from "@/hooks/use-ideas"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { BarChart2, Lightbulb, Users } from "lucide-react"

export default function DashboardPage() {
  const { user } = useUser()
  const department = user?.unsafeMetadata?.department as string || ""
  const { ideas, mutate } = useIdeas(department)

  const stats = [
    {
      title: "Total Ideas",
      value: ideas?.length || 0,
      icon: Lightbulb,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Implemented",
      value: Array.isArray(ideas) 
        ? ideas.filter(idea => idea.status === "implemented").length 
        : 0,
      icon: BarChart2,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Contributors",
      value: Array.isArray(ideas) 
        ? [...new Set(ideas.map(idea => idea.author_id))].length 
        : 0,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 sm:px-6 py-4 sm:py-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl sm:text-4xl font-bold text-indigo-900"
        >
          Dashboard
        </motion.h1>
        <AddIdeaDialog 
          department={department} 
          onIdeaAdded={() => mutate()}
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Ideas Section */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Recent Ideas
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <IdeasGrid 
            department={department}
       // Show only recent 5 ideas
          />
        </div>
      </div>
    </motion.div>
  )
} 