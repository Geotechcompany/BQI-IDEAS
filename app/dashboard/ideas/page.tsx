"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { IdeasGrid } from "../../components/ideas-grid"
import { AddIdeaDialog } from "../../components/add-idea-dialog"
import { useIdeas } from "@/hooks/use-ideas"

export default function IdeasPage() {
  const { user } = useUser()
  const department = user?.unsafeMetadata?.department as string || ""
  const { mutate } = useIdeas(department)
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 sm:px-6 py-4 sm:py-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl sm:text-4xl font-bold text-indigo-900"
        >
          Ideas Dashboard
        </motion.h1>
        <AddIdeaDialog 
          department={department} 
          onIdeaAdded={() => mutate()}
        />
      </div>
      
      <IdeasGrid department={department} />
    </motion.div>
  )
} 