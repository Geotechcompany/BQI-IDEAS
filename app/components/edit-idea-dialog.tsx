"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Idea } from "@/types/ideas"

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
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    async function fetchIdea() {
      if (!ideaId) return

      setIsFetching(true)
      try {
        const response = await fetch(`/api/ideas/${ideaId}`)
        if (!response.ok) throw new Error('Failed to fetch idea')
        
        const idea: Idea = await response.json()
        setTitle(idea.title)
        setDescription(idea.description)
        setCategory(idea.category)
      } catch (error) {
        console.error('Failed to fetch idea:', error)
      } finally {
        setIsFetching(false)
      }
    }

    if (open && ideaId) {
      fetchIdea()
    } else {
      // Reset form when dialog closes
      setTitle("")
      setDescription("")
      setCategory("")
    }
  }, [ideaId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ideaId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category })
      })

      if (!response.ok) throw new Error('Failed to update idea')
      onSave()
    } catch (error) {
      console.error('Failed to update idea:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Idea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isFetching}
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isFetching}
            />
          </div>
          <div>
            <Select 
              value={category} 
              onValueChange={setCategory}
              disabled={isFetching}
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
              disabled={isLoading || isFetching}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || isFetching}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 