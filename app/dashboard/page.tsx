"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { IdeasGrid } from "../components/ideas-grid"
import { AddIdeaDialog } from "../components/add-idea-dialog"
import { useIdeas } from "@/hooks/use-ideas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Lightbulb, Users } from "lucide-react"

export default function DashboardPage() {
  const { user } = useUser()
  const department = user?.publicMetadata?.department as string || ""
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
      value: ideas?.filter(idea => idea.status === "implemented").length || 0,
      icon: BarChart2,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Contributors",
      value: [...new Set(ideas?.map(idea => idea.author_id) || [])].length,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-6 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-indigo-900"
        >
          Dashboard
        </motion.h1>
        <AddIdeaDialog 
          department={department} 
          onIdeaAdded={() => mutate()}
        />
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 mb-8 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Ideas Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Ideas</h2>
        <IdeasGrid 
          department={department} 
        />
      </div>
    </motion.div>
  )
} 