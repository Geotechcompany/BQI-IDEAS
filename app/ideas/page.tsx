"use client"

import { useUser } from "@clerk/nextjs"
import { IdeasGrid } from "@/components/ideas-grid"
import { AddIdeaDialog } from "@/components/add-idea-dialog"
import { useIdeas } from "@/hooks/use-ideas"

export default function IdeasPage() {
  const { user } = useUser()
  const { mutate } = useIdeas()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Ideas</h1>
        <AddIdeaDialog 
          department={user?.publicMetadata?.department as string} 
          onIdeaAdded={() => mutate()}
        />
      </div>
      <IdeasGrid department={user?.publicMetadata?.department as string} />
    </div>
  )
} 