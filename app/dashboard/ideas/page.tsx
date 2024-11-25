"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { IdeasGrid } from "../../components/ideas-grid"
import { AddIdeaForm } from "../../components/add-idea-form"

export default function IdeasPage() {
  const { user } = useUser()
  const department = user?.publicMetadata?.department as string || ""
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-6 py-8"
    >
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold text-indigo-900 mb-8"
      >
        Ideas Dashboard
      </motion.h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <IdeasGrid department={department} />
        </div>
        <div>
          <AddIdeaForm department={department} />
        </div>
      </div>
    </motion.div>
  )
} 