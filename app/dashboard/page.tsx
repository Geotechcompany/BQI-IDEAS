"use client"

import { useUser } from "@clerk/nextjs"
import { IdeasGrid } from "../components/ideas-grid"
import { AddIdeaForm } from "../components/add-idea-form"

export default function DashboardPage() {
  const { user } = useUser()
  const department = user?.publicMetadata?.department as string || ""

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <IdeasGrid department={department} />
        </div>
        <div>
          <AddIdeaForm department={department} />
        </div>
      </div>
    </div>
  )
} 