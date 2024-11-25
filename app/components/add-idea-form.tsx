'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useIdeas } from '@/hooks/use-ideas'
import type { IdeaInput } from '@/types/ideas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface AddIdeaFormProps {
  department: string
}

export function AddIdeaForm({ department }: AddIdeaFormProps) {
  const { user } = useUser()
  const { mutate } = useIdeas(department)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    const newIdea: IdeaInput = {
      title,
      description,
      category,
      department,
      author_id: user.id
    }

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIdea)
      })

      if (!response.ok) throw new Error('Failed to create idea')

      // Revalidate the ideas cache
      mutate()

      // Reset form
      setTitle('')
      setDescription('')
      setCategory('')
    } catch (error) {
      console.error('Failed to create idea:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Idea</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Sustainability">Sustainability</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Submit Idea</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

