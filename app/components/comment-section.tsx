"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { MessageSquare, Trash2, Reply, ChevronDown, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CommentSectionProps {
  ideaId: number
  comments: Comment[]
  onCommentAdded: () => void
  onCommentDeleted: (commentId: number) => void
}

interface Comment {
  id: number
  content: string
  user_id: string
  created_at: string
  parent_id?: number | null
  replies?: Comment[]
}

export function CommentSection({ ideaId, comments, onCommentAdded, onCommentDeleted }: CommentSectionProps) {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [comment, setComment] = useState("")
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (parentId?: number) => {
    if (!comment.trim()) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: comment,
          parent_id: parentId 
        }),
      })
      
      if (!response.ok) throw new Error("Failed to add comment")
      
      setComment("")
      setReplyingTo(null)
      onCommentAdded()
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/comments/${commentId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) throw new Error("Failed to delete comment")
      onCommentDeleted(commentId)
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const CommentItem = ({ comment, level = 0 }: { comment: Comment, level?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${level > 0 ? 'ml-8 border-l-2 pl-4 border-gray-100' : ''}`}
    >
      <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
        <Avatar className="w-8 h-8">
          <AvatarFallback>{comment.user_id[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-medium">
                {comment.user_id === user?.id ? 'You' : 'User'}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-gray-500 hover:text-indigo-600"
              >
                <Reply className="h-4 w-4" />
              </Button>
              
              {comment.user_id === user?.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(comment.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 mt-1">{comment.content}</p>
          
          {replyingTo === comment.id && (
            <div className="mt-3">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleSubmit(comment.id)
                    setReplyText("")
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Replying...
                    </>
                  ) : (
                    'Reply'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} level={level + 1} />
      ))}
    </motion.div>
  )

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        {comments.length} Comments
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>

            <div className="space-y-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
