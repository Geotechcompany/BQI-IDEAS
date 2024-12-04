"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useIdeas } from "@/hooks/use-ideas"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import {
  CheckCircle2,
  XCircle,
  MessageSquare,
  ThumbsUp,
} from "lucide-react"
import toast from "react-hot-toast"

export function AdminIdeasGrid() {
  const { ideas, isLoading, isError, mutate } = useIdeas()
  const [isUpdating, setIsUpdating] = useState<number | null>(null)

  const handleUpdateStatus = async (ideaId: number, status: string) => {
    setIsUpdating(ideaId)
    try {
      const response = await fetch(`/api/ideas/${ideaId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update status")
      
      toast.success(`Idea ${status} successfully`)
      mutate()
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setIsUpdating(null)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Failed to load ideas</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ideas?.map((idea) => (
        <motion.div
          key={idea.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{idea.title}</CardTitle>
                <Badge
                  variant={
                    idea.status === "approved"
                      ? "secondary"
                      : idea.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                  className={idea.status === "approved" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {idea.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1">
              <p className="text-gray-600">{idea.description}</p>
              <div className="mt-4 flex gap-4">
                <span className="flex items-center text-sm text-gray-500">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {idea._count.likes_by}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {idea._count.comments}
                </span>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-4">
              <div className="flex justify-between w-full gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleUpdateStatus(idea.id, "approved")}
                  disabled={isUpdating === idea.id || idea.status === "approved"}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleUpdateStatus(idea.id, "rejected")}
                  disabled={isUpdating === idea.id || idea.status === "rejected"}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 