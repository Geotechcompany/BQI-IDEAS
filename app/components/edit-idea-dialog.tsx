"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface EditIdeaDialogProps {
  ideaId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function EditIdeaDialog({ ideaId, open, onOpenChange, onSave }: EditIdeaDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (ideaId && open) {
      fetchIdeaDetails()
    }
  }, [ideaId, open])

  const fetchIdeaDetails = async () => {
    setIsFetching(true)
    try {
      const response = await fetch(`/api/ideas/${ideaId}`)
      if (!response.ok) throw new Error("Failed to fetch idea")
      const idea = await response.json()
      setTitle(idea.title)
      setDescription(idea.description)
      setCategory(idea.category)
    } catch (error) {
      console.error("Failed to fetch idea:", error)
      toast.error("Failed to load idea details")
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ideaId) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category }),
      })

      if (!response.ok) throw new Error("Failed to update idea")
      
      toast.success("Idea updated successfully")
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update idea:", error)
      toast.error("Failed to update idea")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Idea</DialogTitle>
        </DialogHeader>
        {isFetching ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Select 
                value={category} 
                onValueChange={setCategory}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 