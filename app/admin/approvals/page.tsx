"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { useApprovals } from "../../hooks/use-approvals"
import toast from "react-hot-toast"

export default function ApprovalsPage() {
  const [selectedTab, setSelectedTab] = useState("pending")
  const { approvals, isLoading, mutate } = useApprovals(selectedTab)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)

  const handleUpdateStatus = async (ideaId: number, status: string) => {
    setIsUpdating(ideaId)
    try {
      const response = await fetch(`/api/ideas/${ideaId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error()
      
      toast.success(`Idea ${status} successfully`)
      mutate()
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Engineering":
        return "text-blue-600"
      case "Operations":
        return "text-purple-600"
      case "Professional Services":
        return "text-indigo-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Approvals</h1>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid gap-6">
              {approvals?.map((idea: Idea) => (
                <Card key={idea.id}>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {idea.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted by {idea.author_id} • 
                        <span className={getDepartmentColor(idea.department)}>
                          {" "}{idea.department}
                        </span>
                      </p>
                    </div>
                    <Badge className={getStatusColor(idea.status)}>
                      {idea.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {idea.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>{idea._count.likes_by} likes</span>
                        <span>{idea._count.comments} comments</span>
                        <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                      </div>
                      {selectedTab === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(idea.id, "rejected")}
                            disabled={isUpdating === idea.id}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(idea.id, "approved")}
                            disabled={isUpdating === idea.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

interface Idea {
  id: number
  title: string
  description: string
  author_id: string
  department: string
  status: string
  created_at: string
  _count: {
    likes_by: number
    comments: number
  }
} 