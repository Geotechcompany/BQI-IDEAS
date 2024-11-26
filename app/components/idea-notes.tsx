"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StickyNote } from "./sticky-note"
import { Plus } from "lucide-react"
import { nanoid } from "nanoid"

interface Note {
  id: string
  content: string
  color: string
}

const STICKY_COLORS = [
  "bg-yellow-100",
  "bg-pink-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-purple-100",
]

interface IdeaNotesProps {
  ideaId: number
  initialNotes?: Note[]
  onNotesChange?: (notes: Note[]) => void
}

export function IdeaNotes({ ideaId, initialNotes = [], onNotesChange }: IdeaNotesProps) {
  const [notes, setNotes] = useState<Note[]>(() => 
    initialNotes.map(note => ({
      id: note.id,
      content: note.content,
      color: note.color
    }))
  )

  const handleAddNote = () => {
    const newNote: Note = {
      id: nanoid(),
      content: "New note...",
      color: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)]
    }
    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    onNotesChange?.(updatedNotes)
  }

  const handleSaveNote = (id: string, content: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, content } : note
    )
    setNotes(updatedNotes)
    onNotesChange?.(updatedNotes)
  }

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    onNotesChange?.(updatedNotes)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddNote}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            content={note.content}
            color={note.color}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
          />
        ))}
      </div>
    </div>
  )
} 