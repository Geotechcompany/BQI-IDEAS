"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Search, Filter, Trash2, Edit2, CheckCircle, XCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { useIdeas } from "@/hooks/use-ideas"
import toast from "react-hot-toast"
import { DEPARTMENTS } from "@/lib/constants"

export default function IdeasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { ideas, isLoading, mutate } = useIdeas()
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [deleteIdea, setDeleteIdea] = useState<number | null>(null)

  const filteredIdeas = ideas?.filter(idea => {
    if (searchQuery && !idea.title.toLowerCase().includes(searchQuery.toLowerCase())) 
      return false
    if (departmentFilter !== "all" && idea.department !== departmentFilter) 
      return false
    if (statusFilter !== "all" && idea.status !== statusFilter)
      return false
    return true
  })

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

  const handleDelete = async () => {
    if (!deleteIdea) return

    try {
      const response = await fetch(`/api/ideas/${deleteIdea}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error()
      
      toast.success("Idea deleted successfully")
      mutate()
    } catch (error) {
      toast.error("Failed to delete idea")
    } finally {
      setDeleteIdea(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Engineering":
        return "bg-blue-100 text-blue-800"
      case "Operations":
        return "bg-purple-100 text-purple-800"
      case "Professional Services":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Ideas Management</h1>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIdeas?.map((idea) => (
              <TableRow key={idea.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{idea.title}</TableCell>
                <TableCell>
                  <Badge className={getDepartmentColor(idea.department)}>
                    {idea.department}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(idea.status)}>
                    {idea.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(idea.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUpdateStatus(idea.id, "approved")}
                    disabled={isUpdating === idea.id || idea.status === "approved"}
                    className="hover:bg-green-100 text-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUpdateStatus(idea.id, "rejected")}
                    disabled={isUpdating === idea.id || idea.status === "rejected"}
                    className="hover:bg-red-100 text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteIdea(idea.id)}
                    className="hover:bg-red-100 text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteIdea} onOpenChange={() => setDeleteIdea(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the idea
              and all associated data including comments, likes, and notifications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
} 