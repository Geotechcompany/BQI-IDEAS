"use client"

import { motion, Reorder, useDragControls } from "framer-motion"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Grip, X, Save, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StickyNoteProps {
  id: string
  content: string
  color: string
  onSave: (id: string, content: string) => void
  onDelete: (id: string) => void
}

export function StickyNote({ id, content: initialContent, color, onSave, onDelete }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(initialContent)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={{ id, content, color }}
      id={id}
      dragListener={false}
      dragControls={dragControls}
    >
      <motion.div
        className={cn(
          "relative p-4 rounded-lg shadow-lg transform rotate-1",
          "hover:rotate-0 transition-transform duration-200",
          color
        )}
        whileHover={{ scale: 1.02 }}
        layout
      >
        <div className="absolute -top-3 -right-3 flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-full bg-white shadow-sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-full bg-white shadow-sm hover:bg-red-50 hover:text-red-500"
            onClick={() => onDelete(id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div 
          className="cursor-move mb-2" 
          onPointerDown={(e) => dragControls.start(e)}
        >
          <Grip className="h-4 w-4 text-gray-400" />
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] bg-white/50 resize-none"
            />
            <Button
              size="sm"
              onClick={() => {
                onSave(id, content)
                setIsEditing(false)
              }}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
      </motion.div>
    </Reorder.Item>
  )
} 