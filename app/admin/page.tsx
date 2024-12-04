"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { useIdeas } from "../../hooks/use-ideas"
import { 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Award,
  Activity
} from "lucide-react"
import { AdminIdeasGrid } from "../components/admin/admin-ideas-grid"
import { Skeleton } from "../../components/ui/skeleton"
import { Badge } from "../../components/ui/badge"
import { DEPARTMENTS } from "../lib/constants"

function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  loading 
}: { 
  title: string
  value: number | string
  description?: string
  icon: any
  trend?: number
  loading?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <Icon className="h-5 w-5 text-indigo-500" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              )}
              {trend !== undefined && (
                <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${trend < 0 && 'rotate-180'}`} />
                  {Math.abs(trend)}% from last month
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DepartmentCard({ department, count, total }: { department: string; count: number; total: number }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{department}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{count}</div>
          <Badge variant="secondary">{percentage}%</Badge>
        </div>
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const { user } = useUser()
  const { ideas, isLoading } = useIdeas()

  const stats = [
    {
      title: "Pending Approval",
      value: ideas?.filter(idea => idea.status === "pending").length || 0,
      icon: Clock,
      description: "Ideas awaiting review",
      trend: 12
    },
    {
      title: "Approved Ideas",
      value: ideas?.filter(idea => idea.status === "approved").length || 0,
      icon: CheckCircle2,
      description: "Successfully approved ideas",
      trend: 8
    },
    {
      title: "Implementation Rate",
      value: `${ideas?.length ? Math.round((ideas.filter(i => i.status === "approved").length / ideas.length) * 100) : 0}%`,
      icon: Award,
      description: "Ideas moved to implementation",
      trend: -5
    },
    {
      title: "Total Activity",
      value: ideas?.reduce((acc, idea) => acc + idea._count.comments + idea._count.likes_by, 0) || 0,
      icon: Activity,
      description: "Comments and likes combined",
      trend: 15
    }
  ]

  // Calculate department statistics
  const departmentStats = DEPARTMENTS.map(dept => ({
    department: dept,
    count: ideas?.filter(idea => idea.department === dept).length || 0,
    total: ideas?.length || 0
  }))

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold text-gray-900"
          >
            Welcome back, {user?.firstName}!
          </motion.h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your ideas platform.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            trend={stat.trend}
            loading={isLoading}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {departmentStats.map(({ department, count, total }) => (
          <DepartmentCard
            key={department}
            department={department}
            count={count}
            total={total}
          />
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Ideas</h2>
          <Badge variant="secondary" className="text-base">
            <BarChart2 className="h-4 w-4 mr-1" />
            {ideas?.length || 0} Total Ideas
          </Badge>
        </div>
        <AdminIdeasGrid />
      </div>
    </motion.div>
  )
} 